// src/scripts/pages/search/search-page.js
import CONFIG from '../../config';

const SearchPage = {
  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>

      <section id="content" class="search">
        <div class="search__container">
          <h2 class="search__title">Search Movies</h2>
          
          <form id="searchForm" class="search__form">
            <div class="search__input-container">
              <label for="searchInput" class="visually-hidden">Search for movies</label>
              <input 
                type="search" 
                id="searchInput" 
                name="query" 
                placeholder="Search for movies..." 
                aria-label="Search for movies"
                required
              >
              <button type="submit" class="search__button" aria-label="Search">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>
        </div>
        
        <div class="search__results">
          <div id="searchStatsContainer" class="search__stats" style="display: none;">
            Found <span id="resultCount">0</span> results for "<span id="searchQuery"></span>"
          </div>
          
          <div id="searchResults" class="movies__list"></div>
          
          <div id="loading" class="loading">
            <div class="loading__spinner"></div>
          </div>
          
          <div id="emptyState" class="empty-state">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>Search for your favorite movies</p>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    this._initSearchForm();
    
    // Check if there's a query parameter in the URL
    const url = new URL(window.location.href);
    const query = url.searchParams.get('query');
    
    if (query) {
      document.getElementById('searchInput').value = query;
      this._searchMovies(query);
    } else {
      document.getElementById('emptyState').style.display = 'flex';
    }
  },

  _initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const searchInput = document.getElementById('searchInput');
      const query = searchInput.value.trim();
      
      if (query) {
        // Update URL with query parameter for shareable links
        const url = new URL(window.location.href);
        url.searchParams.set('query', query);
        window.history.pushState({}, '', url);
        
        this._searchMovies(query);
      }
    });
  },

  async _searchMovies(query) {
    this._showLoading(true);
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('searchResults').innerHTML = '';
    
    try {
      const response = await fetch(
        `${CONFIG.BASE_URL}/search/movie?api_key=${CONFIG.TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      
      const data = await response.json();
      
      // Update search stats
      document.getElementById('searchQuery').textContent = query;
      document.getElementById('resultCount').textContent = data.total_results;
      document.getElementById('searchStatsContainer').style.display = 'block';
      
      if (data.results && data.results.length > 0) {
        this._renderSearchResults(data.results);
      } else {
        this._renderNoResults();
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      this._renderError('Failed to search movies. Please try again later.');
    } finally {
      this._showLoading(false);
    }
  },

  _renderSearchResults(movies) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    
    movies.forEach(movie => {
      const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/src/public/images/placeholder.png';
      
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-item');
      movieElement.innerHTML = `
        <a href="#/detail/${movie.id}" class="movie-item__link">
          <div class="movie-item__header">
            <img src="${posterUrl}" alt="${movie.title}" class="movie-item__poster" loading="lazy">
            <div class="movie-item__rating">
              <i class="fa-solid fa-star"></i>
              <span>${movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          <div class="movie-item__content">
            <h3 class="movie-item__title">${movie.title}</h3>
            <p class="movie-item__release-date">${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
            <p class="movie-item__overview">${this._truncateText(movie.overview || 'No overview available', 100)}</p>
          </div>
        </a>
      `;
      
      resultsContainer.appendChild(movieElement);
    });
    
    // Apply view transitions to search results
    document.startViewTransition && document.startViewTransition(() => {
      resultsContainer.classList.add('visible');
    });
  },

  _renderNoResults() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-film-slash"></i>
        <p>No movies found matching your search</p>
        <p>Try different keywords or check your spelling</p>
      </div>
    `;
  },

  _renderError(message) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = `
      <div class="error-message">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>${message}</p>
      </div>
    `;
  },

  _showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    if (isLoading) {
      loadingElement.classList.add('loading--show');
    } else {
      loadingElement.classList.remove('loading--show');
    }
  },

  _truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
};

export default SearchPage;