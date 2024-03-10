const global = {
  currentPage: window.location.pathname,
};

// Show popular movies
async function showPopularMovies() {
  const popularMovies = document.getElementById('popular-movies');
  const { results } = await fetchData('movie/popular');
  console.log(results);
  results.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card');
    // Check if movie poster exist
    const moviePoster = movie.poster_path
      ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
      : '../images/no-image.jpg';
    card.innerHTML = `
    <a href="/pages/movie-details.html?id=${movie.id}">
            <img src=${moviePoster} class="card-img-top" alt="${movie.title}" />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
    `;
    popularMovies.appendChild(card);
  });
}

// Fetch data from TMDB api
async function fetchData(endpoint) {
  const API_KEY = '57dc4d5627c7069bc2cd661cd5a170ea';
  const API_URL = 'https://api.themoviedb.org/3';

  const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  return data;
}

// Highlight active navbar link
function highlightLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((navLink) => {
    if (navLink.getAttribute('href') === global.currentPage) {
      navLink.classList.add('active');
    }
  });
}

// Runs when app initialize
function initializeApp() {
  switch (global.currentPage) {
    case '/pages/index.html':
      showPopularMovies();
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
  highlightLink();
}

document.addEventListener('DOMContentLoaded', initializeApp);
