// src/scripts/pages/home/home-page.js
import CONFIG from '../../config';

const HomePage = {
  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      
      <section class="hero">
        <div class="hero__inner">
          <h1 class="hero__title">Discover Amazing Movies</h1>
          <p class="hero__tagline">Explore the world of cinema with ID Film</p>
          <a href="#/search" class="hero__cta">
            <i class="fa-solid fa-magnifying-glass"></i> Search Movies
          </a>
        </div>
      </section>

      <section id="content" class="movies">
        <div class="section-header">
          <h2 class="section-title">Popular Movies</h2>
          <a href="#/add" class="btn-add">
            <i class="fa-solid fa-plus"></i> Add Movie
          </a>
        </div>
        
        <div id="movie-list" class="movies__list"></div>
        
        <div id="loading" class="loading">
          <div class="loading__spinner"></div>
        </div>
      </section>

      <section class="user-movies">
        <div class="section-header">
          <h2 class="section-title">Your Added Movies</h2>
        </div>
        
        <div id="user-movie-list" class="movies__list"></div>
      </section>
    `;
  },

  async afterRender() {
    this._showLoading(true);
    try {
      await this._renderPopularMovies();
      await this._renderUserMovies();
    } catch (error) {
      console.error('Error rendering movies:', error);
      this._renderError('Failed to load movies. Please try again later.');
    } finally {
      this._showLoading(false);
    }
  },

  async _renderPopularMovies() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/movie/popular?api_key=${CONFIG.TMDB_API_KEY}`);
      const result = await response.json();
      
      if (result.results && result.results.length > 0) {
        this._renderMovies(result.results, 'movie-list');
      } else {
        this._renderError('No movies found');
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      this._renderError('Failed to fetch popular movies');
    }
  },

  _renderMovies(movies, targetElementId) {
    const movieListElement = document.getElementById(targetElementId);
    movieListElement.innerHTML = '';
    
    movies.forEach(movie => {
      const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/src/public/images/placeholder.png';
      
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-item');
      movieElement.setAttribute('view-transition-name', `movie-${movie.id}`);
      
      movieElement.innerHTML = `
        <a href="#/detail/${movie.id}" class="movie-item__link">
          <div class="movie-item__header">
            <img 
              src="${posterUrl}" 
              alt="${movie.title}" 
              class="movie-item__poster" 
              loading="lazy"
              view-transition-name="movie-poster-${movie.id}"
            >
            <div class="movie-item__rating">
              <i class="fa-solid fa-star"></i>
              <span>${movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          <div class="movie-item__content">
            <h3 class="movie-item__title" view-transition-name="movie-title-${movie.id}">${movie.title}</h3>
            <p class="movie-item__release-date">${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
            <p class="movie-item__overview">${this._truncateText(movie.overview || 'No overview available', 100)}</p>
          </div>
        </a>
      `;
      
      movieListElement.appendChild(movieElement);
    });
    
    // Apply view transitions if supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        movieListElement.classList.add('visible');
      });
    }
  },
  
  async _renderUserMovies() {
    const userMovies = JSON.parse(localStorage.getItem('userMovies')) || [];
    const userMovieList = document.getElementById('user-movie-list');
    
    if (userMovies.length > 0) {
      this._renderMovies(userMovies, 'user-movie-list');
    } else {
      userMovieList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-film"></i>
          <p>You haven't added any movies yet</p>
          <a href="#/add" class="btn-add">Add Your First Movie</a>
        </div>
      `;
    }
  },

  _showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    if (isLoading) {
      loadingElement.classList.add('loading--show');
    } else {
      loadingElement.classList.remove('loading--show');
    }
  },

  _renderError(message) {
    const movieListElement = document.getElementById('movie-list');
    movieListElement.innerHTML = `
      <div class="error-message">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>${message}</p>
      </div>
    `;
  },

  _truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
};

export default HomePage;