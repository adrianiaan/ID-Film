// src/scripts/pages/about/about-page.js
const AboutPage = {
  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>

      <section id="content" class="about">
        <div class="about__header">
          <h2 class="about__title">About ID Film</h2>
          <p class="about__subtitle">Your personal movie catalog app</p>
        </div>
        
        <div class="about__content">
          <div class="about__description">
            <h3>Our Mission</h3>
            <p>ID Film is designed to help movie enthusiasts discover, explore, and keep track of their favorite films. Our mission is to provide a seamless experience for browsing popular movies, searching for specific titles, and creating a personal collection of favorite films.</p>
            
            <h3>Features</h3>
            <ul class="about__features">
              <li>
                <i class="fa-solid fa-film"></i>
                <div>
                  <h4>Browse Popular Movies</h4>
                  <p>Discover trending and popular movies from around the world</p>
                </div>
              </li>
              <li>
                <i class="fa-solid fa-magnifying-glass"></i>
                <div>
                  <h4>Search Movies</h4>
                  <p>Find specific movies by title, genre, or keywords</p>
                </div>
              </li>
              <li>
                <i class="fa-solid fa-heart"></i>
                <div>
                  <h4>Save Favorites</h4>
                  <p>Create your own collection of favorite movies for easy access</p>
                </div>
              </li>
              <li>
                <i class="fa-solid fa-plus"></i>
                <div>
                  <h4>Add Custom Movies</h4>
                  <p>Add your own movies with details and location information</p>
                </div>
              </li>
              <li>
                <i class="fa-solid fa-map-location-dot"></i>
                <div>
                  <h4>Interactive Maps</h4>
                  <p>Explore filming locations and production countries on interactive maps</p>
                </div>
              </li>
              <li>
                <i class="fa-solid fa-mobile-screen"></i>
                <div>
                  <h4>Responsive Design</h4>
                  <p>Enjoy a seamless experience across all devices</p>
                </div>
              </li>
            </ul>
            
            <h3>Data Source</h3>
            <p>ID Film uses <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">The Movie Database (TMDB)</a> as its primary data source. TMDB is a community-built movie and TV database that provides comprehensive information about films, including details, ratings, and media.</p>
            
            <h3>Technologies Used</h3>
            <div class="about__technologies">
              <div class="tech-badge">HTML5</div>
              <div class="tech-badge">CSS3</div>
              <div class="tech-badge">JavaScript</div>
              <div class="tech-badge">Webpack</div>
              <div class="tech-badge">PWA</div>
              <div class="tech-badge">IndexedDB</div>
              <div class="tech-badge">Leaflet.js</div>
              <div class="tech-badge">TMDB API</div>
              <div class="tech-badge">Workbox</div>
              <div class="tech-badge">FontAwesome</div>
            </div>
          </div>
          
          <div class="about__creator">
            <h3>Developer</h3>
            <div class="developer-card">
              <img src="https://source.unsplash.com/random/200x200/?portrait" alt="Developer Portrait" class="developer-image">
              <div class="developer-info">
                <h4>Dicoding Student</h4>
                <p class="developer-role">Front-End Web Developer</p>
                <p class="developer-bio">This application was developed as a submission for Dicoding's Front-End Web Developer Expert course. The focus was on creating a responsive, accessible, and performant web application with modern web technologies.</p>
                <div class="developer-social">
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i class="fa-brands fa-github"></i>
                  </a>
                  <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                  <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <i class="fa-brands fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    // Additional functionality can be added here if needed
  }
};

export default AboutPage;