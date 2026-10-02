-- Enable the PostGIS extension for spatial queries and geometry support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the sightings table for campus wildlife tracking
CREATE TABLE IF NOT EXISTS sightings (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  location GEOMETRY(Point, 4326) NOT NULL,
  species_tag TEXT DEFAULT 'Unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for high performance spatial queries
CREATE INDEX IF NOT EXISTS sightings_location_idx ON sightings USING GIST (location);

-- Add species_tag column if table was previously created
ALTER TABLE sightings ADD COLUMN IF NOT EXISTS species_tag TEXT DEFAULT 'Unknown';
