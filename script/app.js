const global = {
  currentPage: window.location.pathname,
};

// Show popular movies
async function showPopularMovies() {
  const popularMovies = document.getElementById('popular-movies');
  const { results } = await fetchData('movie/popular');
  results.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card');
    // Check if movie poster exist
    const moviePoster = movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
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

// Show popular tv shows
async function showPopularTvShows() {
  const popularShows = document.getElementById('popular-shows');
  const { results } = await fetchData('tv/popular');
  results.forEach((show) => {
    const tvShow = document.createElement('div');
    tvShow.classList.add('card');
    // Check if tv show poster exist
    const showPoster = show.poster_path
      ? `https://image.tmdb.org/t/p/original${show.poster_path}`
      : '../images/no-image.jpg';
    tvShow.innerHTML = `
    <a href="/pages/tv-shows.html?id=${show.id}">
            <img src=${showPoster} class="card-img-top" alt="${show.name}" />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>
    `;
    popularShows.appendChild(tvShow);
  });
}

// Overlay background image of content


// Movie details page display
async function showMovieDetails() {
  const movieID = Number(window.location.search.split('=')[1]);
  const movieDetails = document.getElementById('movie-details-wrapper');
  const movie = await fetchData(`movie/${movieID}`);
  console.log(movie);

  // showBackgroundImg('movie', movie.backdrop_path);
  const moviePoster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : '../images/no-image.jpg';
  const div = document.createElement('div');
  div.setAttribute('id', 'movie-details');
  div.innerHTML = `<div class="details-top">
  <div>
    <img src="${moviePoster}" class="card-img-top" alt="${movie.title}" />
  </div>
  <div class="movie-overview">
    <h2>${movie.title}</h2>
    <p class="movie-score">
    <i class="fa-solid fa-star"></i>
      ${movie.vote_average.toFixed(1)} / 10 
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>${movie.overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${movie.genres.map((movie) => `<li>${movie.name}</li>`).join('')}
    </ul>
    <div class="btn-group">
    <a href="${movie.homepage}" target="_blank" class="btn btn-homepage">Movie Page</a>
    <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-imdb">Visit IMDB</a>
    </div>
  </div>
</div>
<div class="details-bottom">
<div class="movie-info">
  <h3>Movie Info</h3>
  <ul>
    <li><span class="text-ternary">Budget:</span> ${movie.budget.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })}</li>
    <li><span class="text-ternary">Revenue:</span> ${movie.revenue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })}</li>
    <li><span class="text-ternary">Duration:</span> ${movie.runtime} minutes</li>
    <li><span class="text-ternary">Status:</span> ${movie.status}</li>
  </ul>
  </div>
  
  <div class="production-info">
  <h3>Companies</h3>
  <div class="list-group">${movie.production_companies.map((company) => {
    return ' ' + company.name;
  })}</div>
  </div>
</div>`;
  movieDetails.appendChild(div);
}

// Fetch production companies details


// Fetch data from TMDB api
async function fetchData(endpoint) {
  const API_KEY = '57dc4d5627c7069bc2cd661cd5a170ea';
  const API_URL = 'https://api.themoviedb.org/3';
  // while data fecthing spinner display
  showSpinner();
  const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  hideSpinner();
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

// Display spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

// Hide spinner
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Runs when app initialize
function initializeApp() {
  switch (global.currentPage) {
    case '/pages/index.html':
      showPopularMovies();
      break;
    case '/pages/tv-shows.html':
      showPopularTvShows();
      break;
    case '/pages/show-details.html':
      console.log('show details');
      break;
    case '/pages/movie-details.html':
      showMovieDetails();
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
