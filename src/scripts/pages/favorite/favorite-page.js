// src/scripts/pages/favorite/favorite-page.js
import CONFIG from '../../config';

const FavoritePage = {
  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>

      <section id="content" class="favorites">
        <div class="section-header">
          <h2 class="section-title">Your Favorite Movies</h2>
        </div>
        
        <div id="favorite-list" class="movies__list"></div>
        
        <div id="emptyState" class="empty-state" style="display: none;">
          <i class="fa-regular fa-heart"></i>
          <p>You don't have any favorite movies yet</p>
          <a href="#/" class="btn-primary">Explore Movies</a>
        </div>
      </section>
    `;
  },

  async afterRender() {
    await this._renderFavoriteMovies();
    this._initRemoveAllButton();
  },

  async _renderFavoriteMovies() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteListElement = document.getElementById('favorite-list');
    const emptyStateElement = document.getElementById('emptyState');
    
    // Show empty state if no favorites
    if (favorites.length === 0) {
      favoriteListElement.innerHTML = '';
      emptyStateElement.style.display = 'flex';
      return;
    }
    
    // Hide empty state and show list
    emptyStateElement.style.display = 'none';
    favoriteListElement.innerHTML = '';
    
    // Add "Clear All" button if we have favorites
    favoriteListElement.insertAdjacentHTML('beforebegin', `
      <div class="favorites__actions">
        <button id="clearAllFavorites" class="btn-danger">
          <i class="fa-solid fa-trash-can"></i> Remove All Favorites
        </button>
      </div>
    `);
    
    // Render each favorite movie
    favorites.forEach(movie => {
      const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/src/public/images/placeholder.png';
      
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-item');
      movieElement.dataset.id = movie.id;
      movieElement.innerHTML = `
        <div class="movie-item__header">
          <img src="${posterUrl}" alt="${movie.title}" class="movie-item__poster" loading="lazy">
          <div class="movie-item__rating">
            <i class="fa-solid fa-star"></i>
            <span>${movie.vote_average.toFixed(1)}</span>
          </div>
          <button class="btn-remove-favorite" data-id="${movie.id}" aria-label="Remove from favorites">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="movie-item__content">
          <h3 class="movie-item__title">${movie.title}</h3>
          <p class="movie-item__release-date">${new Date(movie.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}</p>
          <p class="movie-item__overview">${this._truncateText(movie.overview, 100)}</p>
          <a href="#/detail/${movie.id}" class="btn-detail">
            View Details
          </a>
        </div>
      `;
      
      favoriteListElement.appendChild(movieElement);
      
      // Add event listener to remove button
      const removeButton = movieElement.querySelector('.btn-remove-favorite');
      removeButton.addEventListener('click', event => {
        event.stopPropagation();
        const movieId = parseInt(event.currentTarget.dataset.id);
        this._removeFromFavorites(movieId);
      });
    });
    
    // Apply view transitions if supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        favoriteListElement.classList.add('visible');
      });
    }
  },

  _initRemoveAllButton() {
    const clearAllButton = document.getElementById('clearAllFavorites');
    
    if (clearAllButton) {
      clearAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove all favorite movies?')) {
          localStorage.removeItem('favorites');
          this._renderFavoriteMovies();
        }
      });
    }
  },

  _removeFromFavorites(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    // Find the element and apply a removal animation
    const movieElement = document.querySelector(`.movie-item[data-id="${movieId}"]`);
    
    if (movieElement) {
      movieElement.classList.add('removing');
      
      // Remove the element after animation completes
      movieElement.addEventListener('animationend', () => {
        if (updatedFavorites.length === 0) {
          // If that was the last favorite, reload to show empty state
          this._renderFavoriteMovies();
        } else {
          movieElement.remove();
        }
      });
    }
  },

  _truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
};

export default FavoritePage;