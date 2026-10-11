# WILDLENS: Project Architecture & Context Master Document

## 1. Project Overview
**WildLens** is a gated, professional campus wildlife tracking web application built for Universal AI University. It features a strict architectural separation between a premium public-facing landing page and a private, authenticated application dashboard. The core feature is a "Smart Upload" pipeline that utilizes two AI models (Gemini 1.5 Flash and a CLIP vision model) to identify animal species and perform 1:1 facial recognition on specific campus pets using a vector database.

## 2. Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS, React Router DOM, Lucide React.
*   **Backend:** Node.js, Express, Multer (memory storage only), CORS.
*   **Database & Auth:** Supabase (PostgreSQL with PostGIS for geospatial data), Supabase Auth.
*   **Cloud Storage:** Supabase Storage (`sightings` public bucket).
*   **AI / Machine Learning:** 
    *   Google Gen AI (`gemini-1.5-flash`) for general species tagging.
    *   Hugging Face Transformers (`@xenova/transformers` - `Xenova/clip-vit-base-patch32`) running via Node.js for 512-dimensional image feature extraction.
*   **Vector Database:** Pinecone (`campus-pets` index, 512 dimensions, cosine metric).

## 3. Directory & File Arrangement
```text
wildlens/
├── .env                      # Frontend env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── package.json              # Frontend dependencies
├── vite.config.js            
├── src/
│   ├── main.jsx              # React DOM render & Router wrapper
│   ├── App.jsx               # Route definitions & Auth state listener
│   ├── lib/
│   │   └── supabase.js       # Frontend Supabase client (uses anon key)
│   ├── pages/
│   │   ├── Landing.jsx       # Public informational site (Hero, How It Works, Teaser)
│   │   └── Dashboard.jsx     # Private app container (Map, Feed, Upload)
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.jsx # Multi-step onboarding (Name -> Avatar -> Email -> Verify)
│   │   ├── dashboard/
│   │   │   ├── Navbar.jsx    # Shows user Avatar, Name, and Logout
│   │   │   ├── PhotoFeed.jsx # Masonry grid of sightings (displays image, species, pet name)
│   │   │   ├── LiveMap.jsx   # PostGIS/Leaflet map of sightings
│   │   │   └── SmartUploadModal.jsx # 2-Step AI upload flow
│   │   └── ui/               # Reusable Tailwind components (buttons, inputs, cards)
│
└── server/                   # Node.js Express Backend
    ├── .env                  # Backend env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, PINECONE_API_KEY)
    ├── package.json          # Backend dependencies (@google/generative-ai, @pinecone-database/pinecone, @xenova/transformers, multer, etc.)
    └── server.js             # Core backend logic, AI pipelines, and API routes
```

## 4. Core Features & Completed Work

### A. Authentication & Onboarding
*   **Domain Restriction:** Account creation is strictly limited to `@universalai.in` email addresses.
*   **Multi-Step Onboarding:** Users do not just sign up; they select a "Scout Name" and a "Scout Character" (Avatar). This metadata is saved to the Supabase session (`options.data`).
*   **Verification Gate:** Supabase Email Confirmations are enabled. The frontend AuthModal swaps to a "Check your email" UI upon signup instead of immediately logging the user in.
*   **Protected Routing:** `/dashboard/*` routes are completely inaccessible without an active Supabase session.

### B. Two-Step "Smart Upload" & AI Pipeline
The application features an advanced 2-step photo upload pipeline managed by `SmartUploadModal.jsx` and `server.js`.
*   **Step 1: AI Scan (`POST /api/ai/scan`)**
    *   User selects an image and locks GPS. Image is sent as a buffer to the server.
    *   Server passes the image to Gemini 1.5 Flash to identify the general species.
    *   Server passes the image to the CLIP transformer model to generate a 512D vector embedding.
    *   Server queries Pinecone. If a match > 0.85 confidence is found, it returns the known Pet Name and ID. If no match is found, it prompts the frontend to ask the user if they want to name the new animal.
*   **Step 2: Database Commit (`POST /api/upload`)**
    *   Server uploads the file buffer to the Supabase `sightings` bucket using the `service_role` key (bypassing RLS).
    *   If a `newPetName` is provided, the server registers the new pet in the PostgreSQL `campus_pets` table and upserts the vector to Pinecone.
    *   The final sighting is saved to the PostgreSQL `sightings` table with PostGIS coordinates, the Supabase public image URL, Gemini species tag, and `pet_id`.

### C. Dashboard UI
*   **Photo Feed:** Renders uploaded images, correctly linking sightings to specific campus pets (e.g., displaying "Bruno" instead of just "Dog").
*   **Live Map:** Displays geographical data of sightings across the campus.

## 5. Database Schema Overview
*   **PostgreSQL `campus_pets`:** Stores `id` (UUID), `name` (String), `created_at`.
*   **PostgreSQL `sightings`:** Stores `id`, `user_id` (Auth UID), `image_url` (Supabase Storage URL), `species_tag` (Gemini output), `pet_id` (Foreign Key to `campus_pets`), `location` (PostGIS point), `created_at`.
*   **Pinecone `campus-pets`:** 512-dimension vector index using cosine similarity. Vector IDs match the `campus_pets` UUID. Metadata stores the pet's name.
