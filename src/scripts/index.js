// src/scripts/index.js
import 'regenerator-runtime';
import '../styles/styles.css';
import App from './pages/app';
import swRegister from './utils/sw-register';

// Load FontAwesome
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

// Load Leaflet for Maps
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Make Leaflet available globally for the app
window.L = L;

// Initialize Leaflet map default options
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.7.1/dist/images/';

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#mainContent'),
    header: document.querySelector('header'),
    footer: document.querySelector('footer')
  });

  // Initialize view transitions if supported
  if (document.startViewTransition) {
    console.log('View Transitions API is supported!');
  } else {
    console.log('View Transitions API is not supported in this browser');
  }

  // Load the initial page
  await app.renderPage();

  // Register service worker
  swRegister();

  // Handle navigation (back/forward buttons)
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

// Handle offline status
window.addEventListener('online', () => {
  console.log('You are back online!');
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  console.log('You are offline');
  document.body.classList.add('offline');
});