-- Enable the PostGIS extension for spatial queries and geometry support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable pgcrypto / uuid-ossp for gen_random_uuid() if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create campus_pets table for known campus pets and animals
CREATE TABLE IF NOT EXISTS campus_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  species VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the sightings table
CREATE TABLE IF NOT EXISTS sightings (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  location GEOMETRY(Point, 4326) NOT NULL,
  species_tag TEXT DEFAULT 'Unknown',
  user_id UUID,
  pet_id UUID REFERENCES campus_pets(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for high performance spatial queries
CREATE INDEX IF NOT EXISTS sightings_location_idx ON sightings USING GIST (location);

-- Migrations for existing sightings table:
-- Add species_tag, user_id, and pet_id foreign key column
ALTER TABLE sightings ADD COLUMN IF NOT EXISTS species_tag TEXT DEFAULT 'Unknown';
ALTER TABLE sightings ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE sightings ADD COLUMN IF NOT EXISTS pet_id UUID REFERENCES campus_pets(id) ON DELETE SET NULL;
