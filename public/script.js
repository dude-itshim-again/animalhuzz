// =========================================================
// AnimalHuzz - Campus Wildlife Tracker Client Script
// =========================================================

let map = null;
let markers = [];
const markersMap = new Map();

// Helper: Get stored auth token
function getAuthToken() {
  return localStorage.getItem('token') || localStorage.getItem('animalhuzz_token');
}

// Helper: Set auth session
function setAuthSession(token, email) {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('animalhuzz_token', token);
  }
  if (email) {
    localStorage.setItem('user_email', email);
  }
}

// Helper: Clear auth session
function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('animalhuzz_token');
  localStorage.removeItem('user_email');
}

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
  const petSelect = document.getElementById('petSelect');

  if (photoInput) photoInput.value = '';
  if (imagePreview) imagePreview.src = '';
  if (previewContainer) previewContainer.style.display = 'none';
  if (uploadPrompt) uploadPrompt.style.display = 'flex';
  if (geoStatusBar) geoStatusBar.className = 'geo-status-bar';
  if (geoStatusText) geoStatusText.textContent = 'GPS coordinates will be captured automatically';
  if (petSelect) petSelect.value = '';
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
      const petName = sighting.pet_name ? `🐾 Pet: ${sighting.pet_name}` : null;
      const species = sighting.species_tag && sighting.species_tag !== 'Unknown' ? sighting.species_tag : 'Sighting';
      const displayTitle = petName || species;

      // Drop Leaflet marker for coordinate
      if (map && hasCoords) {
        const marker = L.marker([lat, lon]).addTo(map);
        const popupContent = `
          <div class="popup-card">
            <div class="popup-img-wrapper">
              <img src="${imageUrl}" alt="${displayTitle} #${sighting.id}" loading="lazy" />
            </div>
            <div class="popup-info">
              <div class="popup-title">🐾 ${displayTitle} #${sighting.id}</div>
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
          <img src="${imageUrl}" alt="Campus wildlife ${displayTitle} #${sighting.id}" loading="lazy">
          <span class="sighting-badge">${displayTitle} #${sighting.id}</span>
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

// Fetch and populate campus pets dropdown
async function fetchPets() {
  const petSelectGroup = document.getElementById('petSelectGroup');
  const petSelect = document.getElementById('petSelect');
  if (!petSelect) return;

  try {
    const res = await fetch('/api/pets');
    if (res.ok) {
      const pets = await res.json();
      if (pets && pets.length > 0) {
        petSelect.innerHTML = '<option value="">None / Wild animal</option>';
        pets.forEach(pet => {
          const opt = document.createElement('option');
          opt.value = pet.id;
          opt.textContent = `${pet.name} (${pet.species})`;
          petSelect.appendChild(opt);
        });
        if (petSelectGroup) petSelectGroup.style.display = 'flex';
      }
    }
  } catch (e) {
    console.warn('Could not load pets:', e);
  }
}

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

  // Auth UI Elements
  const authModal = document.getElementById('authModal');
  const openAuthModalBtn = document.getElementById('openAuthModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const authForm = document.getElementById('authForm');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authSubmitText = document.getElementById('authSubmitText');
  const authError = document.getElementById('authError');
  const authSuccess = document.getElementById('authSuccess');
  const userProfile = document.getElementById('userProfile');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const logoutBtn = document.getElementById('logoutBtn');

  let authMode = 'login'; // 'login' or 'signup'

  // Update Auth UI State
  function updateAuthUI() {
    const token = getAuthToken();
    const email = localStorage.getItem('user_email');

    if (token) {
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'none';
      if (userProfile) userProfile.style.display = 'flex';
      if (userEmailDisplay) userEmailDisplay.textContent = email || 'User';
    } else {
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'block';
      if (userProfile) userProfile.style.display = 'none';
    }
  }

  // Open Modal function
  function showAuthModal(mode = 'login') {
    authMode = mode;
    if (authError) authError.style.display = 'none';
    if (authSuccess) authSuccess.style.display = 'none';

    if (mode === 'signup') {
      if (tabSignup) tabSignup.classList.add('active');
      if (tabLogin) tabLogin.classList.remove('active');
      if (authSubmitText) authSubmitText.textContent = 'Create Account';
    } else {
      if (tabLogin) tabLogin.classList.add('active');
      if (tabSignup) tabSignup.classList.remove('active');
      if (authSubmitText) authSubmitText.textContent = 'Log In';
    }

    if (authModal) authModal.style.display = 'flex';
  }

  // Close Modal function
  function hideAuthModal() {
    if (authModal) authModal.style.display = 'none';
    if (authError) authError.style.display = 'none';
    if (authSuccess) authSuccess.style.display = 'none';
  }

  // Modal Triggers
  if (openAuthModalBtn) {
    openAuthModalBtn.addEventListener('click', () => showAuthModal('login'));
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideAuthModal);
  }
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) hideAuthModal();
    });
  }

  // Tab switching
  if (tabLogin) {
    tabLogin.addEventListener('click', () => showAuthModal('login'));
  }
  if (tabSignup) {
    tabSignup.addEventListener('click', () => showAuthModal('signup'));
  }

  // Logout Trigger
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuthSession();
      updateAuthUI();
      showStatus('You have been logged out.', 'info');
    });
  }

  // =========================================================================
  // Auth Form Submission (Login / Signup Flow)
  // =========================================================================
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = authEmail.value.trim();
      const password = authPassword.value;

      if (!email || !password) {
        if (authError) {
          authError.textContent = 'Please enter both email and password.';
          authError.style.display = 'block';
        }
        return;
      }

      if (authError) authError.style.display = 'none';
      if (authSuccess) authSuccess.style.display = 'none';
      if (authSubmitText) authSubmitText.textContent = 'Processing...';

      const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        const token = data.token || (data.session && data.session.access_token);

        if (token) {
          setAuthSession(token, email);
          updateAuthUI();
          hideAuthModal();
          showStatus(authMode === 'signup' ? 'Account created and logged in!' : 'Logged in successfully!', 'success');
        } else if (authMode === 'signup') {
          // In Supabase, if email confirmation is enabled, a session may not be returned immediately
          if (authSuccess) {
            authSuccess.textContent = 'Registration successful! Please check your email to confirm your account or log in.';
            authSuccess.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        if (authError) {
          authError.textContent = err.message || 'Authentication error';
          authError.style.display = 'block';
        }
      } finally {
        if (authSubmitText) {
          authSubmitText.textContent = authMode === 'signup' ? 'Create Account' : 'Log In';
        }
      }
    });
  }

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
          geoStatusText.textContent = '📍 Photo selected • Ready to upload';
        }
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

  // =========================================================================
  // Upload Sighting Button Event Listener
  // =========================================================================
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      // 1. Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        showAuthModal('login');
        alert('Please log in or sign up before uploading a sighting.');
        return;
      }

      // 2. Check if navigator.geolocation exists
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      uploadBtn.textContent = 'Uploading...';
      uploadBtn.disabled = true;

      if (geoStatusBar && geoStatusText) {
        geoStatusBar.className = 'geo-status-bar active';
        geoStatusText.textContent = 'Acquiring GPS location...';
      }

      // 3. Call navigator.geolocation.getCurrentPosition() with explicit error callback
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
            uploadBtn.textContent = 'Upload Sighting';
            uploadBtn.disabled = false;
            return;
          }

          // Build form data
          const formData = new FormData();
          formData.append('image', file);
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);

          const petSelect = document.getElementById('petSelect');
          if (petSelect && petSelect.value) {
            formData.append('pet_id', petSelect.value);
          }

          // 4. Attach token to Authorization header and send POST to /api/upload
          try {
            const headers = {};
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/upload', {
              method: 'POST',
              headers: headers,
              body: formData
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || errorData.details || `Upload failed with status ${response.status}`);
            }

            const savedRecord = await response.json();

            resetUploadForm();
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
            uploadBtn.textContent = 'Upload Sighting';
            uploadBtn.disabled = false;
          }
        },
        (err) => {
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

  // Check auth state on page load
  updateAuthUI();
  if (!getAuthToken()) {
    // Show modal if user is not authenticated as requested in requirement 5
    showAuthModal('login');
  }

  // Load initial sightings and pets
  fetchSightings();
  fetchPets();
}

// Execute setupApp
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupApp);
} else {
  setupApp();
}
