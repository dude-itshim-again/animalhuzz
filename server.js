const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

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
          ST_X(location::geometry) AS longitude, 
          ST_Y(location::geometry) AS latitude, 
          created_at
        FROM sightings
        ORDER BY created_at DESC
      `);
    } catch (colErr) {
      // Fallback in case column in table is named 'image' instead of 'image_url'
      if (colErr.code === '42703' && colErr.message.includes('image_url')) {
        result = await pool.query(`
          SELECT 
            id, 
            image AS image_url, 
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

// POST /api/upload endpoint for sighting photo and GPS coordinates
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
    // Clean up uploaded file if validation fails
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

  // File URL path accessible via static serving
  const imageUrl = `/uploads/${file.filename}`;

  try {
    let result;
    try {
      // Save sighting with PostGIS point (longitude x, latitude y, SRID 4326)
      result = await pool.query(
        `INSERT INTO sightings (image_url, location)
         VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
         RETURNING *`,
        [imageUrl, lon, lat]
      );
    } catch (colErr) {
      // Fallback in case column in table is named 'image' instead of 'image_url'
      if (colErr.code === '42703' && colErr.message.includes('image_url')) {
        result = await pool.query(
          `INSERT INTO sightings (image, location)
           VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
           RETURNING *`,
          [imageUrl, lon, lat]
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

// Start the server
app.listen(PORT, () => {
  console.log(`Campus Wildlife Tracking server running on http://localhost:${PORT}`);
});

module.exports = { app, pool, upload };
