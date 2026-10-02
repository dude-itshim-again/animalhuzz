const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

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

// GET /api/sightings - Fetch all sightings ordered by created_at descending
app.get('/api/sightings', async (req, res) => {
  try {
    let result;
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
    } catch (colErr) {
      // Fallback if species_tag or image_url column variations exist
      if (colErr.code === '42703' && colErr.message.includes('species_tag')) {
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
      } else if (colErr.code === '42703' && colErr.message.includes('image_url')) {
        result = await pool.query(`
          SELECT 
            id, 
            image AS image_url, 
            'Unknown' AS species_tag,
            ST_X(location::geometry) AS longitude, 
            ST_Y(location::geometry) AS latitude, 
            created_at
          FROM sightings
          ORDER BY created_at DESC
        `);
      } else {
        throw colErr;
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
  const { latitude, longitude } = req.body;

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

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const aiText = response.text() ? response.text().trim() : '';

      if (aiText) {
        // Clean up any extra formatting or punctuation
        speciesTag = aiText.replace(/[\r\n\*\"]/g, '').trim() || 'Unknown';
      }
      console.log(`Gemini Vision AI identified animal: "${speciesTag}"`);
    } else {
      console.warn('GEMINI_API_KEY is not set. Defaulting species_tag to "Unknown".');
    }
  } catch (aiError) {
    // 7. If API fails or times out, default species_tag to 'Unknown' so upload still succeeds
    console.error('Gemini Vision AI identification failed:', aiError.message);
    speciesTag = 'Unknown';
  }

  // File URL path accessible via static serving
  const imageUrl = `/uploads/${file.filename}`;

  try {
    let result;
    try {
      // 6. Save sighting to PostgreSQL with PostGIS location and species_tag
      result = await pool.query(
        `INSERT INTO sightings (image_url, location, species_tag)
         VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)
         RETURNING *`,
        [imageUrl, lon, lat, speciesTag]
      );
    } catch (colErr) {
      // If species_tag column is missing, add it dynamically or fallback
      if (colErr.code === '42703' && colErr.message.includes('species_tag')) {
        try {
          await pool.query(`ALTER TABLE sightings ADD COLUMN IF NOT EXISTS species_tag TEXT DEFAULT 'Unknown'`);
          result = await pool.query(
            `INSERT INTO sightings (image_url, location, species_tag)
             VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)
             RETURNING *`,
            [imageUrl, lon, lat, speciesTag]
          );
        } catch (alterErr) {
          result = await pool.query(
            `INSERT INTO sightings (image_url, location)
             VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
             RETURNING *`,
            [imageUrl, lon, lat]
          );
          if (result.rows[0]) {
            result.rows[0].species_tag = speciesTag;
          }
        }
      } else if (colErr.code === '42703' && colErr.message.includes('image_url')) {
        result = await pool.query(
          `INSERT INTO sightings (image, location, species_tag)
           VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)
           RETURNING *`,
          [imageUrl, lon, lat, speciesTag]
        );
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

module.exports = { app, pool, upload, model };
