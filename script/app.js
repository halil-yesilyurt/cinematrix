const global = {
  currentPage: window.location.pathname,
};


function initializeApp() {
  switch (global.currentPage) {
    case '/pages/index.html':
      console.log('main page');
      break;
    case '/pages/tv-shows.html':
      console.log('tv shows');
      break;
    case '/pages/show-details.html':
      console.log('show details');
      break;
    case '/pages/movie-details.html':
      console.log('movie details');
      break;
    case '/pages/search.html':
      console.log('search');
    default:
      console.log('none');
      break;
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);
