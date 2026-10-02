// =========================================================
// AnimalHuzz - Campus Wildlife Tracker Client Script
// =========================================================

let map = null;
let markers = [];
const markersMap = new Map();

// Initialize Leaflet Map
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || map) return map;

  const defaultCoords = [12.9716, 77.5946];

  map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(defaultCoords, 14);

  map.on('focus', () => map.scrollWheelZoom.enable());

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  window.map = map;
  return map;
}

// Format date helper
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

// Fetch all sightings and render on map & feed
async function fetchSightings() {
  const feedContainer = document.getElementById('feed');
  const sightingCount = document.getElementById('sightingCount');

  try {
    const response = await fetch('/api/sightings');
    if (!response.ok) {
      throw new Error(`Failed to load sightings (status: ${response.status})`);
    }

    const sightings = await response.json();

    // Clear existing markers
    markers.forEach(m => {
      if (map) map.removeLayer(m);
    });
    markers = [];
    markersMap.clear();

    if (sightingCount) {
      const count = sightings ? sightings.length : 0;
      sightingCount.textContent = `${count} sighting${count === 1 ? '' : 's'}`;
    }

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

    sightings.forEach((sighting) => {
      const imageUrl = sighting.image_url || sighting.image;
      const lat = parseFloat(sighting.latitude);
      const lon = parseFloat(sighting.longitude);
      const hasCoords = !isNaN(lat) && !isNaN(lon);

      // Drop Leaflet marker for coordinate
      if (map && hasCoords) {
        const marker = L.marker([lat, lon]).addTo(map);
        const popupContent = `
          <div class="popup-card">
            <div class="popup-img-wrapper">
              <img src="${imageUrl}" alt="Sighting #${sighting.id}" loading="lazy" />
            </div>
            <div class="popup-info">
              <div class="popup-title">🐾 Sighting #${sighting.id}</div>
              <div class="popup-time">${formatDate(sighting.created_at)}</div>
              <div class="popup-coords">📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        markers.push(marker);
        markersMap.set(sighting.id, { marker, lat, lon });
      }

      // Render image tag and details in #feed
      const card = document.createElement('div');
      card.className = 'sighting-card';
      card.id = `sighting-${sighting.id}`;

      card.innerHTML = `
        <div class="sighting-image-container">
          <img src="${imageUrl}" alt="Campus wildlife sighting #${sighting.id}" loading="lazy">
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
            <div class="sighting-coords">📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
          ` : ''}
        </div>
      `;

      feedContainer.appendChild(card);
    });

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

window.fetchSightings = fetchSightings;

// Setup Application & Event Listeners
function setupApp() {
  initMap();

  const photoInput = document.getElementById('photoInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadPrompt = document.getElementById('uploadPrompt');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const geoStatusBar = document.getElementById('geoStatusBar');
  const geoStatusText = document.getElementById('geoStatusText');
  const feedContainer = document.getElementById('feed');
  const recenterBtn = document.getElementById('recenterBtn');
  const refreshFeedBtn = document.getElementById('refreshFeedBtn');

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
          geoStatusText.textContent = '📍 Photo selected • Click Upload Sighting to capture GPS';
        }
      }
    });
  }

  // Remove Photo Button
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (photoInput) photoInput.value = '';
      if (imagePreview) imagePreview.src = '';
      if (previewContainer) previewContainer.style.display = 'none';
      if (uploadPrompt) uploadPrompt.style.display = 'flex';
      if (geoStatusBar) geoStatusBar.className = 'geo-status-bar';
      if (geoStatusText) geoStatusText.textContent = 'GPS coordinates will be captured automatically';
    });
  }

  // =========================================================================
  // 1. Ensure the "Upload Sighting" button has a click event listener attached to the correct HTML ID
  // =========================================================================
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      // 2. Check if navigator.geolocation exists. If not, alert the user that their browser doesn't support geolocation.
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      // 5. Provide visual feedback during the upload process (changing button text to 'Uploading...')
      uploadBtn.textContent = 'Uploading...';
      uploadBtn.disabled = true;

      if (geoStatusBar && geoStatusText) {
        geoStatusBar.className = 'geo-status-bar active';
        geoStatusText.textContent = 'Acquiring GPS location...';
      }

      // 3. Call navigator.geolocation.getCurrentPosition() with an explicit error callback function
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          if (geoStatusText) {
            geoStatusText.textContent = `📍 GPS Locked: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }

          // Check if file is selected
          const file = photoInput && photoInput.files && photoInput.files[0];
          if (!file) {
            alert("Please select or capture a photo first.");
            // 5. Reset button text if validation fails
            uploadBtn.textContent = 'Upload Sighting';
            uploadBtn.disabled = false;
            return;
          }

          // Build form data
          const formData = new FormData();
          formData.append('image', file);
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);

          // 4. Use a try...catch block around the fetch() call to catch network errors and log them
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || errorData.details || `Upload failed with status ${response.status}`);
            }

            const savedRecord = await response.json();

            // Clear upload form
            if (photoInput) photoInput.value = '';
            if (imagePreview) imagePreview.src = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (uploadPrompt) uploadPrompt.style.display = 'flex';
            if (geoStatusBar) geoStatusBar.className = 'geo-status-bar';
            if (geoStatusText) geoStatusText.textContent = 'GPS coordinates will be captured automatically';

            alert('Sighting uploaded successfully!');

            // Refresh map and feed
            await fetchSightings();

            if (map) {
              map.flyTo([latitude, longitude], 16, { duration: 1.2 });
            }
          } catch (networkError) {
            console.error("Upload network error:", networkError);
            alert("Upload failed: " + networkError.message);
          } finally {
            // 5. Reset button text after upload completes or fails
            uploadBtn.textContent = 'Upload Sighting';
            uploadBtn.disabled = false;
          }
        },
        (err) => {
          // 3. Explicit error callback function to log permission denials or timeouts
          console.error("Location access error:", err);

          let errorMsg = "Unable to retrieve location.";
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = "Location access was denied. Please allow location permissions in your browser.";
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMsg = "Location information is unavailable. Please check your GPS/network settings.";
          } else if (err.code === err.TIMEOUT) {
            errorMsg = "Location request timed out. Please try again.";
          }

          if (geoStatusBar && geoStatusText) {
            geoStatusBar.className = 'geo-status-bar error';
            geoStatusText.textContent = errorMsg;
          }

          alert("Location access error: " + errorMsg);

          // 5. Reset button text after failure
          uploadBtn.textContent = 'Upload Sighting';
          uploadBtn.disabled = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000
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

  // Initial fetch on page load
  fetchSightings();
}

// Execute setupApp
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupApp);
} else {
  setupApp();
}
