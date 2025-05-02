// src/scripts/routes/routes.js
import HomePage from '../pages/home/home-page';
import DetailMovie from '../pages/detail-movie/detail-movie';
import FavoritePage from '../pages/favorite/favorite-page';
import SearchPage from '../pages/search/search-page';
import AddMovie from '../pages/add-movie/add-movie';
import AboutPage from '../pages/about/about-page';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/detail/:id': DetailMovie,
  '/favorites': FavoritePage,
  '/search': SearchPage,
  '/add': AddMovie,
  '/about': AboutPage,
};

export default routes;