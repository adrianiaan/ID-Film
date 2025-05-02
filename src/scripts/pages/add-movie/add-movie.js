// src/scripts/pages/add-movie/add-movie.js
import CONFIG from '../../config';

const AddMovie = {
  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>

      <section id="content" class="add-movie">
        <h2 class="add-movie__title">Add New Movie</h2>
        
        <form id="addMovieForm" class="add-movie__form">
          <div class="form-group">
            <label for="title">Movie Title</label>
            <input type="text" id="title" name="title" required>
          </div>
          
          <div class="form-group">
            <label for="overview">Overview</label>
            <textarea id="overview" name="overview" rows="5" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="release_date">Release Date</label>
            <input type="date" id="release_date" name="release_date" required>
          </div>
          
          <div class="form-group">
            <label for="genre">Genre</label>
            <select id="genre" name="genre" required>
              <option value="" disabled selected>Select genre</option>
              <option value="28">Action</option>
              <option value="12">Adventure</option>
              <option value="16">Animation</option>
              <option value="35">Comedy</option>
              <option value="80">Crime</option>
              <option value="99">Documentary</option>
              <option value="18">Drama</option>
              <option value="10751">Family</option>
              <option value="14">Fantasy</option>
              <option value="36">History</option>
              <option value="27">Horror</option>
              <option value="10402">Music</option>
              <option value="9648">Mystery</option>
              <option value="10749">Romance</option>
              <option value="878">Science Fiction</option>
              <option value="10770">TV Movie</option>
              <option value="53">Thriller</option>
              <option value="10752">War</option>
              <option value="37">Western</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Movie Poster</label>
            <div class="camera-container">
              <div class="camera-preview">
                <video id="camera" autoplay playsinline></video>
                <canvas id="photoCanvas" style="display: none;"></canvas>
              </div>
              <div class="camera-controls">
                <button type="button" id="startCamera" class="btn-camera">
                  <i class="fa-solid fa-camera"></i> Start Camera
                </button>
                <button type="button" id="takePhoto" class="btn-camera" disabled>
                  <i class="fa-solid fa-camera-retro"></i> Take Photo
                </button>
                <button type="button" id="retakePhoto" class="btn-camera" disabled>
                  <i class="fa-solid fa-rotate"></i> Retake
                </button>
              </div>
              <div id="photoPreview" class="photo-preview"></div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Movie Location</label>
            <p class="map-helper">Click on the map to select the movie's location</p>
            <div id="map" class="add-movie__map"></div>
            <div class="location-details">
              <p>
                Selected Location: <span id="selectedLocation">None</span>
              </p>
              <input type="hidden" id="latitude" name="latitude">
              <input type="hidden" id="longitude" name="longitude">
            </div>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn-submit">
              <i class="fa-solid fa-plus"></i> Add Movie
            </button>
          </div>
        </form>
      </section>
    `;
  },

  async afterRender() {
    this._initMap();
    this._initCamera();
    this._initForm();
  },

  _initMap() {
    // Initialize map centered on a default location (e.g., Jakarta)
    const map = L.map('map').setView([-6.2088, 106.8456], 13);
    
    // Add primary tile layer (OpenStreetMap)
    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add satellite layer
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    // Add topographic layer
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    // Configure base maps for layer control
    const baseMaps = {
      "Street Map": mainLayer,
      "Satellite": satelliteLayer,
      "Topographic": topoLayer
    };
    
    // Add layer control
    L.control.layers(baseMaps).addTo(map);
    
    // Add marker when clicked
    let marker;
    
    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      
      // Update form fields
      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;
      document.getElementById('selectedLocation').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      // Update or add marker
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
      
      // Add popup
      marker.bindPopup("Selected Location").openPopup();
    });
  },

  _initCamera() {
    const cameraElement = document.getElementById('camera');
    const photoCanvas = document.getElementById('photoCanvas');
    const photoPreview = document.getElementById('photoPreview');
    const startCameraBtn = document.getElementById('startCamera');
    const takePhotoBtn = document.getElementById('takePhoto');
    const retakePhotoBtn = document.getElementById('retakePhoto');
    
    let stream = null;
    
    // Start camera
    startCameraBtn.addEventListener('click', async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment'
          },
          audio: false
        });
        
        cameraElement.srcObject = stream;
        startCameraBtn.disabled = true;
        takePhotoBtn.disabled = false;
        
        // Show the active camera
        cameraElement.style.display = 'block';
        photoPreview.innerHTML = '';
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please make sure you have given permission and try again.');
      }
    });
    
    // Take photo
    takePhotoBtn.addEventListener('click', () => {
      // Set canvas dimensions to match video
      photoCanvas.width = cameraElement.videoWidth;
      photoCanvas.height = cameraElement.videoHeight;
      
      // Draw video frame to canvas
      const context = photoCanvas.getContext('2d');
      context.drawImage(cameraElement, 0, 0, photoCanvas.width, photoCanvas.height);
      
      // Get data URL and display preview
      const photoUrl = photoCanvas.toDataURL('image/jpeg');
      photoPreview.innerHTML = `<img src="${photoUrl}" alt="Captured movie poster">`;
      
      // Hide video and show retake button
      cameraElement.style.display = 'none';
      takePhotoBtn.disabled = true;
      retakePhotoBtn.disabled = false;
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    });
    
    // Retake photo
    retakePhotoBtn.addEventListener('click', async () => {
      try {
        // Clear preview and restart camera
        photoPreview.innerHTML = '';
        
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment'
          },
          audio: false
        });
        
        cameraElement.srcObject = stream;
        cameraElement.style.display = 'block';
        
        takePhotoBtn.disabled = false;
        retakePhotoBtn.disabled = true;
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please make sure you have given permission and try again.');
      }
    });
  },

  _initForm() {
    const form = document.getElementById('addMovieForm');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const photoPreview = document.getElementById('photoPreview');
      const photoImage = photoPreview.querySelector('img');
      
      if (!photoImage) {
        alert('Please take a photo for the movie poster');
        return;
      }
      
      if (!document.getElementById('latitude').value || !document.getElementById('longitude').value) {
        alert('Please select a location on the map');
        return;
      }
      
      // Gather form data
      const formData = new FormData(form);
      const movieData = {
        title: formData.get('title'),
        overview: formData.get('overview'),
        release_date: formData.get('release_date'),
        genre_ids: [parseInt(formData.get('genre'))],
        poster: photoImage.src,
        location: {
          latitude: parseFloat(formData.get('latitude')),
          longitude: parseFloat(formData.get('longitude'))
        }
      };
      
      try {
        // In a real app, you would send this to the backend
        // For demo purposes, we'll save to localStorage
        const userMovies = JSON.parse(localStorage.getItem('userMovies')) || [];
        movieData.id = Date.now(); // Use timestamp as ID
        userMovies.push(movieData);
        localStorage.setItem('userMovies', JSON.stringify(userMovies));
        
        alert('Movie added successfully!');
        window.location.hash = '#/';
      } catch (error) {
        console.error('Error saving movie:', error);
        alert('Failed to add movie. Please try again.');
      }
    });
  },
  
  // Clean up resources when navigating away
  clean() {
    const cameraElement = document.getElementById('camera');
    if (cameraElement && cameraElement.srcObject) {
      const stream = cameraElement.srcObject;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      cameraElement.srcObject = null;
    }
  }
};

export default AddMovie;