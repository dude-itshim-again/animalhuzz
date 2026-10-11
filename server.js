const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const pool = require('./db');

// Global AI Initialization: Pre-load CLIP vision model on boot
let clipExtractor = null;

async function loadAIModel() {
    try {
        console.log("⏳ Loading AI Vision Model (This takes a minute on first boot)...");
        // Use dynamic import if required by your module setup, or standard require
        const { pipeline } = await import('@xenova/transformers'); 
        clipExtractor = await pipeline('image-feature-extraction', 'Xenova/clip-vit-base-patch32');
        console.log("✅ CLIP AI Model loaded successfully!");
    } catch (error) {
        console.error("❌ Failed to load AI model:", error);
    }
}
loadAIModel();

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================================================
// 1. BACKEND INITIALIZATION & SECURE STORAGE
// =========================================================================

// Initialize Supabase Client using SUPABASE_SERVICE_ROLE_KEY to bypass Row Level Security for file uploads
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://coshnbmkspglsyovxbpl.supabase.co';
let supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
// Clean potential token prefix if JWT starts with eyJ
if (supabaseServiceRoleKey && supabaseServiceRoleKey.includes('eyJ')) {
  supabaseServiceRoleKey = supabaseServiceRoleKey.substring(supabaseServiceRoleKey.indexOf('eyJ'));
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Configure Multer storage using memoryStorage() (no local disk saving)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB limit
  }
});

// Initialize Pinecone Client targeting the 'campus-pets' index
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ''
});
const pineconeIndex = pinecone.index('campus-pets');

// Initialize Google Gen AI SDK using GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiFlashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Helper function to retrieve or wait for the pre-loaded CLIP vision model
async function getClipPipeline() {
  if (clipExtractor) {
    return clipExtractor;
  }
  let attempts = 0;
  while (!clipExtractor && attempts < 120) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    attempts++;
  }
  if (clipExtractor) {
    return clipExtractor;
  }
  await loadAIModel();
  if (clipExtractor) {
    return clipExtractor;
  }
  throw new Error('Failed to load CLIP vision model.');
}

// Helper to extract 512-dimensional vector embedding from image buffer
async function getClipImageEmbedding(imageBuffer) {
  const pipe = clipExtractor || await getClipPipeline();
  const { RawImage } = await import('@xenova/transformers');
  
  let processedBuffer = imageBuffer;
  try {
    const sharp = (await import('sharp')).default;
    processedBuffer = await sharp(imageBuffer).toFormat('jpeg').toBuffer();
  } catch (sharpErr) {
    console.warn('Sharp pre-processing note:', sharpErr.message);
  }

  const blob = new Blob([processedBuffer]);
  const rawImage = await RawImage.fromBlob(blob);
  const output = await pipe(rawImage);
  return Array.from(output.data);
}

// Helper to identify animal species using Gemini Vision
async function identifyAnimalSpecies(imageBuffer, mimeType = 'image/jpeg') {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is missing. Defaulting species to "Unknown".');
    return 'Unknown';
  }

  const base64Image = imageBuffer.toString('base64');
  const prompt = "Identify the primary animal in this image in one or two words. Output only the name.";
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType || 'image/jpeg'
    }
  };

  const flashModels = ['gemini-3.8-flash', 'gemini-1.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
  for (const mName of flashModels) {
    try {
      const activeModel = genAI.getGenerativeModel({ model: mName });
      const genResult = await activeModel.generateContent([prompt, imagePart]);
      const response = await genResult.response;
      const aiText = response.text() ? response.text().trim() : '';

      if (aiText) {
        const cleaned = aiText.replace(/[\r\n\*\"]/g, '').trim();
        if (cleaned && cleaned.toLowerCase() !== 'none' && cleaned.toLowerCase() !== 'null') {
          return cleaned;
        }
      }
    } catch (err) {
      console.warn(`Gemini attempt with model ${mName} note:`, err.message);
    }
  }

  return 'Unknown';
}

// Model pre-warming is initiated via loadAIModel() at startup

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving:
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'WildLens Wildlife Tracking API is healthy',
    timestamp: new Date().toISOString()
  });
});

// =========================================================================
// Authentication Endpoints (Supabase Auth)
// =========================================================================

// POST /api/auth/signup - Register a new user
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = data.session?.access_token || null;
    return res.status(201).json({
      message: 'User registered successfully',
      user: data.user,
      session: data.session,
      token: token
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error during signup', details: err.message });
  }
});

// POST /api/auth/login - Authenticate user and return session token
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = data.session?.access_token;
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      session: data.session,
      user: data.user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login', details: err.message });
  }
});

// =========================================================================
// Campus Pets Registry
// =========================================================================

// GET /api/pets - List known campus pets
app.get('/api/pets', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, species, created_at FROM campus_pets ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.warn('Could not query campus_pets table:', err.message);
    res.json([]);
  }
});

/**
 * POST /api/pets/register
 * Admin Pet Registration
 */
app.post('/api/pets/register', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const file = req.file;
  const { name, species } = req.body;

  if (!file || !file.buffer) {
    return res.status(400).json({ error: 'Pet image file is required (form field: "image")' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Pet name is required (form field: "name")' });
  }

  const petName = name.trim();
  const petSpecies = (species && species.trim()) ? species.trim() : 'Campus Pet';

  try {
    console.log(`Generating 512D CLIP embedding for pet "${petName}"...`);
    const embedding = await getClipImageEmbedding(file.buffer);

    const dbResult = await pool.query(
      `INSERT INTO campus_pets (name, species)
       VALUES ($1, $2)
       RETURNING id, name, species, created_at`,
      [petName, petSpecies]
    );

    const newPet = dbResult.rows[0];
    const petUuid = String(newPet.id);
    console.log(`Pet record inserted in PostgreSQL with UUID: ${petUuid}`);

    await pineconeIndex.upsert({
      records: [{
        id: petUuid,
        values: embedding,
        metadata: {
          name: petName,
          species: petSpecies
        }
      }]
    });

    console.log(`Successfully registered and indexed pet "${petName}" (UUID: ${petUuid}) in Pinecone & PostgreSQL`);

    return res.status(201).json({
      message: 'Pet registered and indexed successfully',
      pet: newPet
    });
  } catch (error) {
    console.error('Pet registration failed:', error);
    return res.status(500).json({
      error: 'Failed to register pet',
      details: error.message
    });
  }
});

// =========================================================================
// 2. AI SCANNER ROUTE (POST /api/ai/scan)
// Defensive AI scan route using multer memory storage middleware.
// - 1. Validates image buffer
// - 2. Identifies species with Gemini Vision
// - 3. Generates 512D image embedding using CLIP transformers model
// - 4. Queries Pinecone campus-pets index for match > 0.85
// - 5. Guaranteed JSON return with success flag
// =========================================================================
app.post('/api/ai/scan', upload.single('image'), async (req, res) => {
  try {
    // 1. Validation
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: "No image file provided." });
    }

    console.log('--- AI SCANNER INITIATED ---');

    // 2. Gemini Species Scan
    console.log('AI Scanner: Identifying species with Gemini...');
    let species = 'Unknown';
    try {
      species = await identifyAnimalSpecies(req.file.buffer, req.file.mimetype || 'image/jpeg');
      console.log(`AI Scanner: Gemini species result: "${species}"`);
    } catch (geminiError) {
      console.warn('AI Scanner: Gemini identification note:', geminiError.message);
      species = 'Unknown';
    }

    // 3. CLIP Vector Generation
    console.log('AI Scanner: Generating 512D CLIP embedding...');
    const imageVector = await getClipImageEmbedding(req.file.buffer);

    // 4. Pinecone Query
    console.log("AI Scanner: Querying Pinecone 'campus-pets' index...");
    const queryResponse = await pineconeIndex.query({
      vector: imageVector,
      topK: 1,
      includeMetadata: true
    });

    // 5. Successful JSON Return
    if (queryResponse?.matches?.length > 0) {
      const topMatch = queryResponse.matches[0];
      console.log(`AI Scanner: Top Pinecone candidate: ID=${topMatch.id}, Score=${topMatch.score}`);

      if (topMatch.score > 0.85) {
        const petName = topMatch.metadata?.name || 'Registered Pet';
        console.log(`AI Scanner: MATCH CONFIRMED! Pet: "${petName}" (Score: ${topMatch.score.toFixed(4)})`);
        return res.status(200).json({ 
          success: true, 
          match: true, 
          petName, 
          petId: topMatch.id, 
          species,
          matchScore: topMatch.score
        });
      } else {
        console.log(`AI Scanner: Match score ${topMatch.score.toFixed(4)} <= 0.85. No match.`);
      }
    } else {
      console.log('AI Scanner: No vectors found in Pinecone.');
    }

    return res.status(200).json({ 
      success: true, 
      match: false, 
      species 
    });

  } catch (error) {
    console.error("CRITICAL AI SCAN ERROR:", error);
    // GUARANTEE a valid JSON response even if the AI crashes
    return res.status(500).json({ 
      success: false, 
      error: "AI processing failed.", 
      details: error.message 
    });
  }
});

// =========================================================================
// 3. SIGHTING UPLOAD ENDPOINT (POST /api/upload)
// Accepts image file, lat, lng, species, petId (optional), newPetName (optional)
// - Step 1: Upload image buffer to Supabase sightings bucket and get public URL.
// - Step 2: If newPetName is provided:
//     - Generate CLIP vector again.
//     - Insert new pet into campus_pets Postgres table.
//     - Upsert vector to Pinecone.
//     - Set petId to this newly generated ID.
// - Step 3: Insert sighting into Postgres sightings table with Supabase URL, location, species, and petId.
// =========================================================================

// GET /api/sightings - Fetch all sightings ordered by created_at descending
app.get('/api/sightings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id, 
        s.image_url, 
        COALESCE(s.species_tag, 'Unknown') AS species_tag,
        s.user_id,
        s.pet_id,
        p.name AS pet_name,
        ST_X(s.location::geometry) AS longitude, 
        ST_Y(s.location::geometry) AS latitude, 
        s.created_at
      FROM sightings s
      LEFT JOIN campus_pets p ON s.pet_id = p.id
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sightings:', error);
    res.status(500).json({
      error: 'Failed to retrieve sightings',
      details: error.message
    });
  }
});

app.post('/api/upload', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const file = req.file;
  const { 
    lat: rawLat, 
    latitude: rawLatitude, 
    lng: rawLng, 
    longitude: rawLongitude, 
    lon: rawLon,
    species: rawSpecies,
    species_tag: rawSpeciesTag,
    petId: rawPetId,
    pet_id: rawPet_id,
    newPetName: rawNewPetName,
    new_pet_name: rawNew_pet_name,
    user_id: rawUserId,
    userId: rawBodyUserId 
  } = req.body;

  // 1. Validate file presence
  if (!file || !file.buffer) {
    return res.status(400).json({ error: 'Image file is required (form field: "image")' });
  }

  // 2. Validate GPS coordinates (accepts lat/latitude and lng/longitude)
  const latVal = rawLat !== undefined && rawLat !== '' ? rawLat : rawLatitude;
  const lngVal = rawLng !== undefined && rawLng !== '' ? rawLng : (rawLongitude !== undefined && rawLongitude !== '' ? rawLongitude : rawLon);

  if (latVal === undefined || lngVal === undefined || latVal === null || lngVal === null || latVal === '' || lngVal === '') {
    return res.status(400).json({ error: 'Both latitude (lat) and longitude (lng) coordinates are required' });
  }

  const lat = parseFloat(latVal);
  const lon = parseFloat(lngVal);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: 'Coordinates must be valid numbers' });
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({
      error: 'Coordinates out of bounds (-90 <= lat <= 90, -180 <= lon <= 180)'
    });
  }

  // Sanitize user_id
  let effectiveUserId = rawUserId || rawBodyUserId || null;
  let validUserId = null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (effectiveUserId && typeof effectiveUserId === 'string' && uuidRegex.test(effectiveUserId.trim())) {
    validUserId = effectiveUserId.trim();
  }

  const authHeader = req.headers['authorization'];
  if (!validUserId && authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user && user.id && uuidRegex.test(user.id)) {
        validUserId = user.id;
      }
    } catch (authErr) {
      console.warn('Bearer token check note:', authErr.message);
    }
  }

  // Species resolution (from body or fallback to Gemini scan if not passed)
  let species = (rawSpecies && rawSpecies.trim()) || (rawSpeciesTag && rawSpeciesTag.trim()) || '';
  if (!species) {
    species = await identifyAnimalSpecies(file.buffer, file.mimetype || 'image/jpeg');
  }

  // -------------------------------------------------------------------------
  // STEP 1: Upload image buffer to Supabase sightings bucket and get public URL
  // -------------------------------------------------------------------------
  const fileExt = path.extname(file.originalname || '') || '.jpg';
  const cleanBase = path.basename(file.originalname || 'sighting', fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueFileName = `${Date.now()}-${cleanBase}${fileExt}`;
  let imageUrl = null;

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sightings')
      .upload(uniqueFileName, file.buffer, {
        contentType: file.mimetype || 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error details:', uploadError);
      return res.status(500).json({
        error: 'Failed to upload image to Supabase Storage',
        details: uploadError.message
      });
    }

    const { data: urlData } = supabase.storage
      .from('sightings')
      .getPublicUrl(uniqueFileName);

    imageUrl = urlData?.publicUrl;
    if (!imageUrl) {
      throw new Error('Could not retrieve public URL for uploaded sighting image');
    }
    console.log(`STEP 1: Sighting photo uploaded to Supabase Storage: ${imageUrl}`);
  } catch (storageErr) {
    console.error('Supabase storage upload failed:', storageErr);
    return res.status(500).json({
      error: 'Failed to upload image to cloud storage',
      details: storageErr.message
    });
  }

  // -------------------------------------------------------------------------
  // STEP 2: If newPetName is provided in request body (registering new pet on the fly)
  // - Generate the CLIP vector again.
  // - Insert new pet into campus_pets Postgres table.
  // - Upsert vector to Pinecone.
  // - Set petId to this newly generated ID.
  // -------------------------------------------------------------------------
  let finalPetId = null;
  let finalPetName = null;
  const newPetName = (rawNewPetName && rawNewPetName.trim()) || (rawNew_pet_name && rawNew_pet_name.trim()) || '';

  try {
    if (newPetName) {
      console.log(`STEP 2: New pet registration detected for "${newPetName}". Generating CLIP vector...`);
      const embedding = await getClipImageEmbedding(file.buffer);

      console.log(`STEP 2: Inserting new pet "${newPetName}" into campus_pets table...`);
      const petDbResult = await pool.query(
        `INSERT INTO campus_pets (name, species)
         VALUES ($1, $2)
         RETURNING id, name, species, created_at`,
        [newPetName, species || 'Campus Pet']
      );

      const newPet = petDbResult.rows[0];
      finalPetId = String(newPet.id);
      finalPetName = newPetName;

      console.log(`STEP 2: Upserting vector to Pinecone 'campus-pets' with ID ${finalPetId}...`);
      await pineconeIndex.upsert({
        records: [{
          id: finalPetId,
          values: embedding,
          metadata: {
            name: newPetName,
            species: species || 'Campus Pet'
          }
        }]
      });

      console.log(`STEP 2: On-the-fly pet registration complete: "${newPetName}" (ID: ${finalPetId})`);
    } else {
      // No new pet registration: use existing petId if provided
      const existingPetId = rawPetId || rawPet_id || null;
      if (existingPetId && typeof existingPetId === 'string' && uuidRegex.test(existingPetId.trim())) {
        finalPetId = existingPetId.trim();
      }
    }
  } catch (petRegErr) {
    console.error('STEP 2 Error during on-the-fly pet registration:', petRegErr);
    // Proceed with sighting insertion even if pet indexing had an error
  }

  // -------------------------------------------------------------------------
  // STEP 3: Insert sighting into Postgres sightings table
  // with Supabase URL, location, species, and petId (either existing, newly created, or null)
  // -------------------------------------------------------------------------
  try {
    const insertQuery = `
      INSERT INTO sightings (image_url, location, species_tag, user_id, pet_id)
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6)
      RETURNING 
        id, 
        image_url, 
        species_tag, 
        user_id, 
        pet_id, 
        ST_X(location::geometry) AS longitude, 
        ST_Y(location::geometry) AS latitude, 
        created_at
    `;

    const dbResult = await pool.query(insertQuery, [
      imageUrl,
      lon, // $2 = longitude
      lat, // $3 = latitude
      species || 'Unknown',
      validUserId,
      finalPetId
    ]);

    const savedSighting = dbResult.rows[0];

    // Populate pet_name if known or lookup from campus_pets
    if (finalPetName) {
      savedSighting.pet_name = finalPetName;
    } else if (savedSighting.pet_id) {
      try {
        const petRes = await pool.query('SELECT name FROM campus_pets WHERE id = $1', [savedSighting.pet_id]);
        if (petRes.rows.length > 0) {
          savedSighting.pet_name = petRes.rows[0].name;
        }
      } catch (pErr) {
        console.warn('Campus pet name lookup note:', pErr.message);
      }
    }

    console.log(`STEP 3: Sighting recorded! ID: ${savedSighting.id}, Species: "${savedSighting.species_tag}", Pet: "${savedSighting.pet_name || 'None'}"`);

    return res.status(201).json(savedSighting);
  } catch (dbError) {
    console.error('STEP 3: Error saving sighting to PostgreSQL:', dbError);
    return res.status(500).json({
      error: 'Failed to record sighting in database',
      details: dbError.message
    });
  }
});

// Global error handler ensuring all errors (including Multer errors) always return JSON
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || (err instanceof multer.MulterError ? 400 : 500);
  return res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    details: err.code || undefined
  });
});

// Start the server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`WildLens Wildlife Tracking server running on http://localhost:${PORT}`);
  });
}

module.exports = { 
  app, 
  pool, 
  upload, 
  supabase, 
  pinecone, 
  pineconeIndex, 
  geminiFlashModel, 
  get clipExtractor() { return clipExtractor; },
  loadAIModel,
  getClipPipeline, 
  getClipImageEmbedding 
};
