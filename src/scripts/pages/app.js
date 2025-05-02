// src/scripts/pages/app.js
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';

class App {
  constructor({ content, header, footer }) {
    this._content = content;
    this._header = header;
    this._footer = footer;
    this._initialAppShell();
  }

  _initialAppShell() {
    this._renderHeader();
    this._renderFooter();
  }

  _renderHeader() {
    this._header.innerHTML = `
      <header class="app-bar">
        <div class="app-bar__brand">
          <a href="#/">
            <img src="/images/logo.png" alt="ID Film Logo" class="app-bar__logo">
            <h1 class="app-bar__title">ID Film</h1>
          </a>
        </div>
        <button id="hamburgerButton" class="app-bar__menu" aria-label="Navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav id="navigationDrawer" class="app-bar__navigation">
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href="#/search">Search</a></li>
            <li><a href="#/favorites">Favorites</a></li>
            <li><a href="#/add">Add Movie</a></li>
            <li><a href="#/about">About</a></li>
          </ul>
        </nav>
      </header>
    `;

    this._initAppBarEvents();
  }

  _renderFooter() {
    this._footer.innerHTML = `
      <footer>
        <div class="footer-content">
          <div class="footer-brand">
            <img src="/images/logo.png" alt="ID Film Logo" class="footer-logo">
            <p class="footer-text">ID Film &copy; ${new Date().getFullYear()}</p>
          </div>
          <div class="footer-links">
            <h3>Navigation</h3>
            <ul>
              <li><a href="#/">Home</a></li>
              <li><a href="#/search">Search</a></li>
              <li><a href="#/favorites">Favorites</a></li>
              <li><a href="#/add">Add Movie</a></li>
              <li><a href="#/about">About</a></li>
            </ul>
          </div>
          <div class="footer-social">
            <h3>Follow Us</h3>
            <div class="social-icons">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-facebook"></i>
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-twitter"></i>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>Made with <i class="fa-solid fa-heart"></i> for Dicoding Submission</p>
        </div>
      </footer>
    `;
  }

  _initAppBarEvents() {
    const hamburgerButton = document.getElementById('hamburgerButton');
    const navigationDrawer = document.getElementById('navigationDrawer');
    
    hamburgerButton.addEventListener('click', (event) => {
      event.stopPropagation();
      navigationDrawer.classList.toggle('open');
    });
    
    // Close navigation drawer when clicking anywhere on the document
    document.addEventListener('click', (event) => {
      if (navigationDrawer.classList.contains('open') && 
          !navigationDrawer.contains(event.target) && 
          !hamburgerButton.contains(event.target)) {
        navigationDrawer.classList.remove('open');
      }
    });
    
    // Handle navigation links
    const navLinks = document.querySelectorAll('.app-bar__navigation a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navigationDrawer.classList.remove('open');
      });
    });
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url] || routes['/'];
    
    try {
      // Clean up previous page if necessary
      if (this._currentPage && this._currentPage.clean) {
        this._currentPage.clean();
      }
      
      // Apply View Transition API if supported
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          this._content.innerHTML = await page.render();
          window.scrollTo(0, 0);
        }).ready;
        
        // Set current page after transition is ready
        this._currentPage = page;
        
        // Run after render once transition is ready
        await page.afterRender();
      } else {
        // Fallback for browsers that don't support View Transition API
        this._content.innerHTML = await page.render();
        window.scrollTo(0, 0);
        this._currentPage = page;
        await page.afterRender();
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this._content.innerHTML = `
        <div class="error-container">
          <h2>Error Loading Page</h2>
          <p>Sorry, something went wrong. Please try again later.</p>
          <p class="error-details">${error.message}</p>
          <button class="btn-primary" id="btnRetry">Retry</button>
        </div>
      `;
      
      // Add retry functionality
      document.getElementById('btnRetry').addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
}

export default App;