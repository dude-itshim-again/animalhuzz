// =========================================================
// AnimalHuzz - Campus Wildlife Tracker Client Script
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const photoInput = document.getElementById('photoInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');
  const statusMessage = document.getElementById('statusMessage');
  const uploadPrompt = document.getElementById('uploadPrompt');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const geoStatusBar = document.getElementById('geoStatusBar');
  const geoStatusText = document.getElementById('geoStatusText');
  const sightingCount = document.getElementById('sightingCount');
  const recenterBtn = document.getElementById('recenterBtn');
  const refreshFeedBtn = document.getElementById('refreshFeedBtn');
  const feedContainer = document.getElementById('feed');

  // Initialize Leaflet Map
  // Default coordinates fallback (campus center or global default)
  const defaultCoords = [12.9716, 77.5946];
  const map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false // Better touch/scroll behavior on mobile
  }).setView(defaultCoords, 14);

  // Enable scroll zoom on click/tap
  map.on('focus', () => map.scrollWheelZoom.enable());

  // Add OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Layer group for all sighting markers
  const markersLayer = L.featureGroup().addTo(map);
  const markersMap = new Map();

  // Custom Wildlife Marker Pin Icon
  const wildlifeIcon = L.divIcon({
    className: 'custom-wildlife-pin',
    html: `
      <div style="
        background: #10b981;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
      ">
        <span style="transform: rotate(45deg); font-size: 15px;">🐾</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });

  // Helper: Format Date
  function formatDate(isoString) {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  }

  // Helper: Display Status Toast Message
  let statusTimeout = null;
  function showStatus(text, type = 'info') {
    if (statusTimeout) clearTimeout(statusTimeout);
    statusMessage.textContent = text;
    statusMessage.className = `status-toast ${type}`;
    statusMessage.style.display = 'block';

    statusTimeout = setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 6000);
  }

  // Helper: Set Button Loading State
  function setLoading(isLoading, text = 'Upload Sighting') {
    if (isLoading) {
      uploadBtn.disabled = true;
      btnSpinner.style.display = 'inline-block';
      btnText.textContent = text;
    } else {
      uploadBtn.disabled = false;
      btnSpinner.style.display = 'none';
      btnText.textContent = 'Upload Sighting';
    }
  }

  // Helper: Reset Upload Form
  function resetUploadForm() {
    photoInput.value = '';
    imagePreview.src = '';
    previewContainer.style.display = 'none';
    uploadPrompt.style.display = 'flex';
    geoStatusBar.className = 'geo-status-bar';
    geoStatusText.textContent = 'GPS coordinates will be captured automatically';
  }

  // Handle Photo Selection & Preview
  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        uploadPrompt.style.display = 'none';
        previewContainer.style.display = 'flex';
      };
      reader.readAsDataURL(file);

      // Check GPS availability immediately to give quick user feedback
      if ('geolocation' in navigator) {
        geoStatusBar.className = 'geo-status-bar active';
        geoStatusText.textContent = '📍 Photo selected • Ready to capture GPS';
      }
    } else {
      resetUploadForm();
    }
  });

  // Handle Remove Photo Button
  removePhotoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUploadForm();
  });

  // Drag and Drop Effects on Upload Zone
  const uploadZone = document.getElementById('uploadZone');
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    }, false);
  });
  ['dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    }, false);
  });

  // =========================================================
  // Fetch Sightings Function
  // Fetches GET /api/sightings, renders Leaflet markers, and builds photo feed
  // =========================================================
  async function fetchSightings() {
    try {
      const response = await fetch('/api/sightings');
      if (!response.ok) {
        throw new Error(`Failed to load sightings (status ${response.status})`);
      }

      const sightings = await response.json();
      renderSightings(sightings);
    } catch (err) {
      console.error('Error fetching sightings:', err);
      feedContainer.innerHTML = `
        <div class="feed-empty">
          <div class="feed-empty-icon">⚠️</div>
          <div class="feed-empty-title">Could not load sightings</div>
          <p class="feed-empty-text">${err.message || 'Please verify the backend connection and try again.'}</p>
        </div>
      `;
    }
  }

  // Render Sightings onto Map and Feed
  function renderSightings(sightings) {
    // Clear existing markers and map references
    markersLayer.clearLayers();
    markersMap.clear();

    // Update count badge
    const count = sightings ? sightings.length : 0;
    sightingCount.textContent = `${count} sighting${count === 1 ? '' : 's'}`;

    if (!sightings || sightings.length === 0) {
      feedContainer.innerHTML = `
        <div class="feed-empty">
          <div class="feed-empty-icon">🦉</div>
          <div class="feed-empty-title">No sightings reported yet</div>
          <p class="feed-empty-text">Be the first to photograph and report campus wildlife!</p>
        </div>
      `;
      return;
    }

    // Clear feed container
    feedContainer.innerHTML = '';

    sightings.forEach((sighting) => {
      const lat = parseFloat(sighting.latitude);
      const lon = parseFloat(sighting.longitude);
      const hasCoords = !isNaN(lat) && !isNaN(lon);

      // 1. Add Leaflet Marker
      if (hasCoords) {
        const marker = L.marker([lat, lon], { icon: wildlifeIcon });

        const popupContent = `
          <div class="popup-card">
            <div class="popup-img-wrapper">
              <img src="${sighting.image_url}" alt="Campus Sighting #${sighting.id}" loading="lazy" />
            </div>
            <div class="popup-info">
              <div class="popup-title">🐾 Sighting #${sighting.id}</div>
              <div class="popup-time">${formatDate(sighting.created_at)}</div>
              <div class="popup-coords">${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
        markersMap.set(sighting.id, { marker, lat, lon });
      }

      // 2. Render Chronological Photo Feed Item
      const card = document.createElement('div');
      card.className = 'sighting-card';
      card.id = `sighting-${sighting.id}`;

      card.innerHTML = `
        <div class="sighting-image-container">
          <img src="${sighting.image_url}" alt="Campus wildlife sighting #${sighting.id}" loading="lazy">
          <span class="sighting-badge">#${sighting.id}</span>
        </div>
        <div class="sighting-meta">
          <div class="meta-header">
            <span class="sighting-timestamp">${formatDate(sighting.created_at)}</span>
            ${hasCoords ? `
              <button type="button" class="view-map-link" data-id="${sighting.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                View on Map
              </button>
            ` : ''}
          </div>
          ${hasCoords ? `
            <div class="sighting-coords">
              📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}
            </div>
          ` : ''}
        </div>
      `;

      feedContainer.appendChild(card);
    });

    // Fit map bounds to markers if any exist
    if (markersLayer.getLayers().length > 0) {
      map.fitBounds(markersLayer.getBounds().pad(0.12));
    }
  }

  // Handle "View on Map" Clicks from the Feed
  feedContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-map-link');
    if (btn) {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const record = markersMap.get(id);
      if (record) {
        // Scroll to map smoothly
        document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Pan and open popup
        map.flyTo([record.lat, record.lon], 17, { duration: 1.0 });
        setTimeout(() => {
          record.marker.openPopup();
        }, 1000);
      }
    }
  });

  // Recenter Map Button
  recenterBtn.addEventListener('click', () => {
    if (markersLayer.getLayers().length > 0) {
      map.fitBounds(markersLayer.getBounds().pad(0.12));
    } else {
      map.setView(defaultCoords, 14);
    }
  });

  // Refresh Feed Button
  refreshFeedBtn.addEventListener('click', () => {
    fetchSightings();
  });

  // =========================================================
  // Upload Sighting Event Listener
  // =========================================================
  uploadBtn.addEventListener('click', () => {
    // a) Check if a file is selected
    const file = photoInput.files[0];
    if (!file) {
      showStatus('Please select or capture a photo first.', 'error');
      return;
    }

    // b) Call navigator.geolocation.getCurrentPosition()
    if (!('geolocation' in navigator)) {
      showStatus('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setLoading(true, 'Acquiring GPS location...');
    geoStatusBar.className = 'geo-status-bar active';
    geoStatusText.textContent = 'Acquiring high accuracy GPS coordinates...';

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        geoStatusText.textContent = `📍 Location locked: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setLoading(true, 'Uploading sighting...');

        // c) Append the file, latitude, and longitude to a FormData object
        const formData = new FormData();
        formData.append('image', file);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        // d) Send a POST request using fetch() to /api/upload
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const errorJson = await response.json().catch(() => ({}));
            throw new Error(errorJson.error || errorJson.details || `Upload failed (Status ${response.status})`);
          }

          const savedData = await response.json();

          // e) Refresh the map and feed upon a successful response
          showStatus('Wildlife sighting uploaded successfully!', 'success');
          resetUploadForm();
          await fetchSightings();

          // Pan to newly added sighting
          map.flyTo([latitude, longitude], 16, { duration: 1.2 });
        } catch (err) {
          console.error('Upload request error:', err);
          showStatus(err.message || 'Failed to upload sighting. Please try again.', 'error');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.error('Geolocation error:', geoError);
        let errorMsg = 'Failed to retrieve location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. Please enable GPS permissions in your browser.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS position unavailable. Please check your network/location settings.';
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMsg = 'GPS request timed out. Please try again.';
        }

        geoStatusBar.className = 'geo-status-bar error';
        geoStatusText.textContent = errorMsg;
        showStatus(errorMsg, 'error');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });

  // Initial Fetch on Page Load
  fetchSightings();
});
