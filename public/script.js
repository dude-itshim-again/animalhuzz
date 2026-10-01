// =========================================================
// AnimalHuzz - Campus Wildlife Tracker Client Script
// =========================================================

// Global Map and Marker references
let map = null;
let markers = [];
const markersMap = new Map();

// Initialize Leaflet Map
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return null;

  // Default coordinates (campus center)
  const defaultCoords = [12.9716, 77.5946];
  
  map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(defaultCoords, 14);

  // Enable scroll zoom when map receives focus
  map.on('focus', () => map.scrollWheelZoom.enable());

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  window.map = map;
  return map;
}

// Format timestamp helper
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

// Display toast message helper
let statusTimeout = null;
function showStatus(text, type = 'info') {
  const statusMessage = document.getElementById('statusMessage');
  if (!statusMessage) return;

  if (statusTimeout) clearTimeout(statusTimeout);
  statusMessage.textContent = text;
  statusMessage.className = `status-toast ${type}`;
  statusMessage.style.display = 'block';

  statusTimeout = setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 6000);
}

// Reset upload form
function resetUploadForm() {
  const photoInput = document.getElementById('photoInput');
  const imagePreview = document.getElementById('imagePreview');
  const previewContainer = document.getElementById('previewContainer');
  const uploadPrompt = document.getElementById('uploadPrompt');
  const geoStatusBar = document.getElementById('geoStatusBar');
  const geoStatusText = document.getElementById('geoStatusText');

  if (photoInput) photoInput.value = '';
  if (imagePreview) imagePreview.src = '';
  if (previewContainer) previewContainer.style.display = 'none';
  if (uploadPrompt) uploadPrompt.style.display = 'flex';
  if (geoStatusBar) geoStatusBar.className = 'geo-status-bar';
  if (geoStatusText) geoStatusText.textContent = 'GPS coordinates will be captured automatically';
}

// =========================================================
// Function: Fetch Sightings on Page Load and After Upload
// Loops through data, drops Leaflet markers, and renders image tags in #feed
// =========================================================
async function fetchSightings() {
  const feedContainer = document.getElementById('feed');
  const sightingCount = document.getElementById('sightingCount');

  try {
    const response = await fetch('/api/sightings');
    if (!response.ok) {
      throw new Error(`Failed to load sightings (status: ${response.status})`);
    }

    const sightings = await response.json();

    // Clear existing markers from map
    markers.forEach(m => {
      if (map) map.removeLayer(m);
    });
    markers = [];
    markersMap.clear();

    // Update count badge if present
    if (sightingCount) {
      const count = sightings ? sightings.length : 0;
      sightingCount.textContent = `${count} sighting${count === 1 ? '' : 's'}`;
    }

    // Render in #feed
    if (!feedContainer) return;
    feedContainer.innerHTML = '';

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

    // Loop through sightings data
    sightings.forEach((sighting) => {
      const imageUrl = sighting.image_url || sighting.image;
      const lat = parseFloat(sighting.latitude);
      const lon = parseFloat(sighting.longitude);
      const hasCoords = !isNaN(lat) && !isNaN(lon);

      // 1. Drop Leaflet marker for each coordinate
      if (map && hasCoords) {
        const marker = L.marker([lat, lon]).addTo(map);

        const popupContent = `
          <div class="popup-card">
            <div class="popup-img-wrapper">
              <img src="${imageUrl}" alt="Sighting #${sighting.id}" loading="lazy" />
            </div>
            <div class="popup-info">
              <div class="popup-title">🐾 Wildlife Sighting #${sighting.id}</div>
              <div class="popup-time">${formatDate(sighting.created_at)}</div>
              <div class="popup-coords">📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        markers.push(marker);
        markersMap.set(sighting.id, { marker, lat, lon });
      }

      // 2. Render image tags and sighting details in #feed div
      const card = document.createElement('div');
      card.className = 'sighting-card';
      card.id = `sighting-${sighting.id}`;

      // Image container with <img> tag
      const imgContainer = document.createElement('div');
      imgContainer.className = 'sighting-image-container';

      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = `Campus wildlife sighting #${sighting.id}`;
      img.loading = 'lazy';

      const badge = document.createElement('span');
      badge.className = 'sighting-badge';
      badge.textContent = `#${sighting.id}`;

      imgContainer.appendChild(img);
      imgContainer.appendChild(badge);

      // Metadata section
      const meta = document.createElement('div');
      meta.className = 'sighting-meta';

      const metaHeader = document.createElement('div');
      metaHeader.className = 'meta-header';

      const timestamp = document.createElement('span');
      timestamp.className = 'sighting-timestamp';
      timestamp.textContent = formatDate(sighting.created_at);

      metaHeader.appendChild(timestamp);

      if (hasCoords) {
        const viewBtn = document.createElement('button');
        viewBtn.type = 'button';
        viewBtn.className = 'view-map-link';
        viewBtn.setAttribute('data-id', sighting.id);
        viewBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          View on Map
        `;
        metaHeader.appendChild(viewBtn);
      }

      meta.appendChild(metaHeader);

      if (hasCoords) {
        const coords = document.createElement('div');
        coords.className = 'sighting-coords';
        coords.textContent = `📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        meta.appendChild(coords);
      }

      card.appendChild(imgContainer);
      card.appendChild(meta);

      feedContainer.appendChild(card);
    });

    // Auto-fit map to markers if markers exist
    if (map && markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.12));
    }
  } catch (err) {
    console.error('Error fetching sightings:', err);
    if (feedContainer) {
      feedContainer.innerHTML = `
        <div class="feed-empty">
          <div class="feed-empty-icon">⚠️</div>
          <div class="feed-empty-title">Could not load sightings</div>
          <p class="feed-empty-text">${err.message || 'Please check backend connection.'}</p>
        </div>
      `;
    }
  }
}

// Expose fetchSightings globally
window.fetchSightings = fetchSightings;

// =========================================================
// Initialization & Event Listeners
// =========================================================
function setupApp() {
  // Initialize map
  initMap();

  const photoInput = document.getElementById('photoInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadPrompt = document.getElementById('uploadPrompt');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const geoStatusBar = document.getElementById('geoStatusBar');
  const geoStatusText = document.getElementById('geoStatusText');
  const recenterBtn = document.getElementById('recenterBtn');
  const refreshFeedBtn = document.getElementById('refreshFeedBtn');
  const feedContainer = document.getElementById('feed');

  // Photo Selection & Preview Handling
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files && photoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (imagePreview) imagePreview.src = e.target.result;
          if (uploadPrompt) uploadPrompt.style.display = 'none';
          if (previewContainer) previewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);

        if (geoStatusBar && geoStatusText) {
          geoStatusBar.className = 'geo-status-bar active';
          geoStatusText.textContent = '📍 Photo selected • Ready to capture GPS';
        }
      } else {
        resetUploadForm();
      }
    });
  }

  // Remove Photo Button
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetUploadForm();
    });
  }

  // =========================================================
  // Event Listener: "Upload Sighting" Button
  // =========================================================
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      // a) Checks if a file is selected
      const file = photoInput && photoInput.files && photoInput.files[0];
      if (!file) {
        if (typeof alert === 'function') {
          try { alert('Please select a photo first.'); } catch (e) {}
        }
        showStatus('Please select or capture a photo first.', 'error');
        return;
      }

      // b) Calls navigator.geolocation.getCurrentPosition()
      if (!('geolocation' in navigator)) {
        const err = 'Geolocation is not supported by your browser.';
        if (typeof alert === 'function') {
          try { alert(err); } catch (e) {}
        }
        showStatus(err, 'error');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Capturing GPS & Uploading...';
      if (geoStatusBar && geoStatusText) {
        geoStatusBar.className = 'geo-status-bar active';
        geoStatusText.textContent = 'Acquiring high accuracy GPS coordinates...';
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          if (geoStatusText) {
            geoStatusText.textContent = `📍 GPS Locked: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }

          // c) Appends the file, latitude, and longitude to a FormData object
          const formData = new FormData();
          formData.append('image', file);
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);

          // d) Sends a POST request using fetch() to /api/upload
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || errorData.details || `Upload failed (Status ${response.status})`);
            }

            const savedRecord = await response.json();

            // e) Refreshes the map and feed upon a successful response
            showStatus('Wildlife sighting uploaded successfully!', 'success');
            resetUploadForm();
            await fetchSightings();

            // Smooth pan to newly uploaded sighting
            if (map) {
              map.flyTo([latitude, longitude], 16, { duration: 1.2 });
            }
          } catch (uploadError) {
            console.error('Upload failed:', uploadError);
            if (typeof alert === 'function') {
              try { alert(uploadError.message || 'Upload failed'); } catch (e) {}
            }
            showStatus(uploadError.message || 'Failed to upload sighting', 'error');
          } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Sighting';
          }
        },
        (geoError) => {
          console.error('Geolocation error:', geoError);
          let errorMsg = 'Failed to retrieve location.';
          if (geoError.code === geoError.PERMISSION_DENIED) {
            errorMsg = 'Location permission denied. Please enable GPS permissions.';
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            errorMsg = 'GPS signal unavailable. Please ensure location services are enabled.';
          } else if (geoError.code === geoError.TIMEOUT) {
            errorMsg = 'GPS request timed out. Please try again.';
          }

          if (geoStatusBar && geoStatusText) {
            geoStatusBar.className = 'geo-status-bar error';
            geoStatusText.textContent = errorMsg;
          }
          if (typeof alert === 'function') {
            try { alert(errorMsg); } catch (e) {}
          }
          showStatus(errorMsg, 'error');

          uploadBtn.disabled = false;
          uploadBtn.textContent = 'Upload Sighting';
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  }

  // Feed "View on Map" Link Delegate
  if (feedContainer) {
    feedContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-map-link');
      if (btn && map) {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const record = markersMap.get(id);
        if (record) {
          const mapEl = document.getElementById('map');
          if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          map.flyTo([record.lat, record.lon], 17, { duration: 1.0 });
          setTimeout(() => {
            record.marker.openPopup();
          }, 1000);
        }
      }
    });
  }

  // Recenter button
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      if (map && markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.12));
      } else if (map) {
        map.setView([12.9716, 77.5946], 14);
      }
    });
  }

  // Refresh feed button
  if (refreshFeedBtn) {
    refreshFeedBtn.addEventListener('click', () => {
      fetchSightings();
    });
  }

  // Initial fetch of sightings on page load
  fetchSightings();
}

// Run setup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupApp);
} else {
  setupApp();
}
