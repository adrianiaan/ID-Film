// src/scripts/pages/detail-movie/detail-movie.js
import CONFIG from '../../config';
import UrlParser from '../../routes/url-parser';

const DetailMovie = {
  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>

      <section id="content" class="detail-movie">
        <div class="detail-movie__container">
          <div class="detail-movie__poster-container" id="movie-poster"></div>
          <div class="detail-movie__info">
            <h2 class="detail-movie__title" id="movie-title"></h2>
            <div class="detail-movie__meta">
              <p class="detail-movie__release-date" id="movie-release"></p>
              <p class="detail-movie__rating" id="movie-rating"></p>
              <p class="detail-movie__genres" id="movie-genres"></p>
            </div>
            <div class="detail-movie__overview">
              <h3>Overview</h3>
              <p id="movie-overview"></p>
            </div>
            <div class="detail-movie__actions">
              <button class="btn-favorite" id="favoriteButton" aria-label="Add to favorites">
                <i class="fa-regular fa-heart"></i> Add to Favorites
              </button>
            </div>
          </div>
        </div>
        
        <div class="detail-movie__map-container">
          <h3>Movie Location</h3>
          <div id="map" class="detail-movie__map"></div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    // Parse URL to get ID
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const id = url.id;
    
    try {
      // Fetch movie detail
      const response = await fetch(`${CONFIG.BASE_URL}/movie/${id}?api_key=${CONFIG.TMDB_API_KEY}`);
      const movie = await response.json();
      
      this._renderMovie(movie);
      this._initMap(movie);
      this._initFavoriteButton(movie);
    } catch (error) {
      console.error('Error getting movie details:', error);
    }
  },

  _renderMovie(movie) {
    document.title = `${movie.title} | ID Film`;
    
    // Fill in movie details
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-release').textContent = `Release: ${new Date(movie.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    document.getElementById('movie-rating').textContent = `Rating: ${movie.vote_average.toFixed(1)}/10`;
    document.getElementById('movie-overview').textContent = movie.overview;

    // Display genres
    const genreNames = movie.genres.map(genre => genre.name).join(', ');
    document.getElementById('movie-genres').textContent = `Genres: ${genreNames}`;
    
    // Set poster
    const posterContainer = document.getElementById('movie-poster');
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/src/public/images/placeholder.png';
    
    posterContainer.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title} Poster" class="detail-movie__poster">
    `;
  },

  _initMap(movie) {
    // If we have production countries, we'll use the first one's capital as our fallback location
    const defaultCountry = movie.production_countries && movie.production_countries.length > 0 
      ? movie.production_countries[0].iso_3166_1 
      : 'US';
    
    // Let's get country coordinates (in real app, you'd use a geocoding service)
    const countryCoordinates = {
      'US': [37.0902, -95.7129], // United States
      'GB': [51.5074, -0.1278],  // United Kingdom
      'FR': [46.2276, 2.2137],   // France
      'DE': [51.1657, 10.4515],  // Germany
      'IT': [41.8719, 12.5674],  // Italy
      'JP': [36.2048, 138.2529], // Japan
      // Add more country coordinates as needed
    };
    
    // Get coordinates for our movie's production country
    const coordinates = countryCoordinates[defaultCountry] || [0, 0];
    
    // Initialize the map
    const map = L.map('map').setView(coordinates, 5);
    
    // Add the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add a marker for the movie location
    const marker = L.marker(coordinates).addTo(map);
    
    // Add a popup with movie info
    marker.bindPopup(`
      <strong>${movie.title}</strong><br>
      Production country: ${movie.production_countries.map(country => country.name).join(', ')}
    `).openPopup();
    
    // Add satellite view as an alternative layer
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    // Add layer control
    const baseMaps = {
      "Street View": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      "Satellite View": satelliteLayer
    };
    
    L.control.layers(baseMaps).addTo(map);
  },

  _initFavoriteButton(movie) {
    const favoriteButton = document.getElementById('favoriteButton');
    
    // Check if movie is already in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isAlreadyFavorite = favorites.some(favorite => favorite.id === movie.id);
    
    if (isAlreadyFavorite) {
      favoriteButton.innerHTML = '<i class="fa-solid fa-heart"></i> Remove from Favorites';
      favoriteButton.classList.add('favorited');
    }
    
    favoriteButton.addEventListener('click', () => {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const isAlreadyFavorite = favorites.some(favorite => favorite.id === movie.id);
      
      if (isAlreadyFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(favorite => favorite.id !== movie.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        favoriteButton.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Favorites';
        favoriteButton.classList.remove('favorited');
      } else {
        // Add to favorites
        const movieToSave = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          overview: movie.overview.substring(0, 150) + '...'
        };
        
        favorites.push(movieToSave);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoriteButton.innerHTML = '<i class="fa-solid fa-heart"></i> Remove from Favorites';
        favoriteButton.classList.add('favorited');
      }
    });
  }
};

export default DetailMovie;