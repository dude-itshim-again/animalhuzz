const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase Client for User Authentication
const supabaseUrl = process.env.SUPABASE_URL || 'https://coshnbmkspglsyovxbpl.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Google Generative AI SDK with gemini-1.5-flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Ensure public/uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage to store uploaded images inside public/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  }
});

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving:
// 1. All assets in 'public'
app.use(express.static(path.join(__dirname, 'public')));
// 2. Explicit direct access to uploaded files via /uploads/<filename>
app.use('/uploads', express.static(uploadsDir));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Campus Wildlife Tracking API is healthy',
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

// GET /api/pets - List known campus pets
app.get('/api/pets', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, species FROM campus_pets ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    // If campus_pets table is not created yet, return empty list
    res.json([]);
  }
});

// GET /api/sightings - Fetch all sightings ordered by created_at descending
app.get('/api/sightings', async (req, res) => {
  try {
    let result;
    try {
      result = await pool.query(`
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
    } catch (colErr) {
      // Fallback query without joins if new columns are not yet in database
      try {
        result = await pool.query(`
          SELECT 
            id, 
            image_url, 
            COALESCE(species_tag, 'Unknown') AS species_tag,
            ST_X(location::geometry) AS longitude, 
            ST_Y(location::geometry) AS latitude, 
            created_at
          FROM sightings
          ORDER BY created_at DESC
        `);
      } catch (innerErr) {
        result = await pool.query(`
          SELECT 
            id, 
            image_url, 
            'Unknown' AS species_tag,
            ST_X(location::geometry) AS longitude, 
            ST_Y(location::geometry) AS latitude, 
            created_at
          FROM sightings
          ORDER BY created_at DESC
        `);
      }
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sightings:', error);
    res.status(500).json({
      error: 'Failed to retrieve sightings',
      details: error.message
    });
  }
});

// POST /api/upload endpoint for sighting photo, GPS coordinates, and AI animal identification
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
  const { latitude, longitude, pet_id } = req.body;

  // 1. Validate that image file is present
  if (!file) {
    return res.status(400).json({ error: 'Image file is required (form field: "image")' });
  }

  // 2. Validate that GPS coordinates are present
  if (
    latitude === undefined ||
    longitude === undefined ||
    latitude === null ||
    longitude === null ||
    latitude === '' ||
    longitude === ''
  ) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlink(file.path, () => {});
    }
    return res.status(400).json({ error: 'Both latitude and longitude coordinates are required' });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlink(file.path, () => {});
    }
    return res.status(400).json({ error: 'Latitude and longitude must be valid numerical values' });
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlink(file.path, () => {});
    }
    return res.status(400).json({
      error: 'Coordinates out of bounds (-90 <= latitude <= 90, -180 <= longitude <= 180)'
    });
  }

  // Extract user_id from Authorization header if present
  let userId = null;
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (user && user.id) {
        userId = user.id;
      }
    } catch (authErr) {
      console.warn('Could not verify bearer token:', authErr.message);
    }
  }

  const petId = pet_id || null;

  // 3. Intercept the uploaded file to identify the primary animal using Gemini Vision AI
  let speciesTag = 'Unknown';

  try {
    if (process.env.GEMINI_API_KEY) {
      // Read uploaded image file and convert to base64
      const imageBuffer = fs.readFileSync(file.path);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = file.mimetype || 'image/jpeg';

      const prompt = "Identify the primary animal in this image in one or two words (e.g., 'Macaque', 'Stray Dog', 'Kingfisher'). If there is no animal, reply 'Unknown'. Output only the name.";

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      };

      let result;
      try {
        result = await model.generateContent([prompt, imagePart]);
      } catch (genErr) {
        if (genErr.message && (genErr.message.includes('404') || genErr.message.includes('not found') || genErr.message.includes('no longer available'))) {
          console.warn('gemini-1.5-flash is deprecated/retired, falling back to gemini-3.8-flash...');
          const activeModel = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
          result = await activeModel.generateContent([prompt, imagePart]);
        } else {
          throw genErr;
        }
      }

      const response = await result.response;
      const aiText = response.text() ? response.text().trim() : '';

      if (aiText) {
        speciesTag = aiText.replace(/[\r\n\*\"]/g, '').trim() || 'Unknown';
      }
      console.log(`Gemini Vision AI identified animal: "${speciesTag}"`);
    } else {
      console.warn('GEMINI_API_KEY is not set. Defaulting species_tag to "Unknown".');
    }
  } catch (aiError) {
    console.error('Gemini Vision AI identification failed:', aiError.message);
    speciesTag = 'Unknown';
  }

  // File URL path accessible via static serving
  const imageUrl = `/uploads/${file.filename}`;

  try {
    let result;
    try {
      // Save sighting to PostgreSQL with PostGIS location, species_tag, user_id, and pet_id
      result = await pool.query(
        `INSERT INTO sightings (image_url, location, species_tag, user_id, pet_id)
         VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6)
         RETURNING *`,
        [imageUrl, lon, lat, speciesTag, userId, petId]
      );
    } catch (colErr) {
      // Fallback if user_id or pet_id columns don't exist yet
      if (colErr.code === '42703') {
        result = await pool.query(
          `INSERT INTO sightings (image_url, location, species_tag)
           VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)
           RETURNING *`,
          [imageUrl, lon, lat, speciesTag]
        );
        if (result.rows[0]) {
          result.rows[0].user_id = userId;
          result.rows[0].pet_id = petId;
        }
      } else {
        throw colErr;
      }
    }

    const savedRecord = result.rows[0];
    return res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error saving sighting to PostgreSQL:', error);
    return res.status(500).json({
      error: 'Failed to save sighting to database',
      details: error.message
    });
  }
});

// Start the server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Campus Wildlife Tracking server running on http://localhost:${PORT}`);
  });
}

module.exports = { app, pool, upload, model, supabase };
