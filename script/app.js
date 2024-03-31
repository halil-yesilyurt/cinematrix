const global = {
  currentPage: window.location.pathname,
  search: {
    type: '',
    searchTerm: '',
    page: 1,
    totalPage: 1,
    totalResult: 0,
  },
  api: {
    apiKey: '57dc4d5627c7069bc2cd661cd5a170ea',
    apiURL: 'https://api.themoviedb.org/3',
  },
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

// Show upcoming movies
async function showUpcomingMovies() {
  const upcomingMovies = document.getElementById('movie-upcoming');
  const { results } = await fetchData('movie/upcoming');
  console.log(results);
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    // Check if movie poster exist
    const moviePoster = movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : '../images/no-image.jpg';
    div.innerHTML = `<a href="/pages/movie-details.html?id=${movie.id}">
<img src=${moviePoster} class="card-img-top" alt="${movie.title}" />
</a>
<div class="card-body">
<h5 class="card-title">${movie.title}</h5>
<p class="card-text">
  <small class="text-muted">Release Date: ${movie.release_date}</small>
</p>
</div>`;
    upcomingMovies.appendChild(div);
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
    <a href="/pages/tv-details.html?id=${show.id}">
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
function showBackgroundImg(type, path) {
  const style = document.createElement('style');
  style.textContent = `
  #${type}-details-wrapper::after {
    content: "";
    background: url(https://image.tmdb.org/t/p/original${path}) center/cover no-repeat;
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0.1;
    max-width: 100%;
  }
`;
  document.head.appendChild(style);
}

// Movie details page display
async function showMovieDetails() {
  const movieID = Number(window.location.search.split('=')[1]);
  const movieDetails = document.getElementById('movie-details-wrapper');
  const movie = await fetchData(`movie/${movieID}`);

  showBackgroundImg('movie', movie.backdrop_path);

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
    <h3>Genres</h3>
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
  <div class="country-lan-info">
  <h3>Countries</h3>
  <div class="list-group">${movie.production_countries.map((country) => {
    return ' ' + country.name;
  })}</div>
  <h3>Languages</h3>
  <div class="list-group">${movie.spoken_languages.map((lan) => {
    return ' ' + lan.english_name;
  })}</div>
  </div>
  <div class="production-info">
  <h3>Companies</h3>
  <div class="list-group">${await getProductionCompaniesDetails(movie.production_companies)}</div>
  </div>
</div>`;
  movieDetails.appendChild(div);
}

// Tv shows details page display
async function showTvShowDetails() {
  const seriesID = Number(window.location.search.split('=')[1]);
  const tvShowDetails = document.getElementById('show-details-wrapper');
  const tvShow = await fetchData(`tv/${seriesID}`);

  showBackgroundImg('show', tvShow.backdrop_path);

  const tvPoster = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w300${tvShow.poster_path}`
    : '../images/no-image.jpg';
  const div = document.createElement('div');
  div.setAttribute('id', 'show-details');
  div.innerHTML = `<div class="details-top">
  <div>
    <img src="${tvPoster}" class="card-img-top" alt="${tvShow.name}" />
  </div>
  <div class="tv-show-overview">
    <h2>${tvShow.name}</h2>
    <p class="tv-show-score">
    <i class="fa-solid fa-star"></i>
      ${tvShow.vote_average.toFixed(1)} / 10 
    </p>
    <p>${tvShow.overview}</p>
    <h3>Genres</h3>
    <ul class="list-group">
    ${tvShow.genres.map((show) => `<li>${show.name}</li>`).join('')}
    </ul>
    <div class="btn-group">
    <a href="${tvShow.homepage}" target="_blank" class="btn btn-homepage">TV Show Page</a>
    </div>
  </div>
</div>
<div class="details-bottom">
  <div class="tv-show-info">
    <h3>Show Info</h3>
    <ul>
      <li><span class="text-ternary">Status:</span> ${tvShow.status}</li>
      <li><span class="text-ternary">Firts Air:</span> ${tvShow.first_air_date}</li>
      <li><span class="text-ternary">Season:</span> ${tvShow.number_of_seasons}</li>
      <li><span class="text-ternary">Episode:</span> ${tvShow.number_of_episodes}</li>
      ${
        tvShow.episode_run_time.length
          ? `<li><span class="text-ternary">Duration: </span> ${tvShow.episode_run_time} minutes</li>`
          : ''
      }
      ${
        tvShow.next_episode_to_air
          ? `<li><span class="text-ternary">Next Episode:</span> ${tvShow.next_episode_to_air.air_date}</li>`
          : ''
      }
    </ul>
  </div>
  <div class="country-lan-info">
    <h3>Countries</h3>
    <div class="list-group">${tvShow.production_countries.map((country) => {
      return ' ' + country.name;
    })}</div>
    <h3>Languages</h3>
    <div class="list-group">${tvShow.spoken_languages.map((lan) => {
      return ' ' + lan.english_name;
    })}</div>
  </div>
  <div class="production-info">
    <h3>Companies</h3>
    <div class="list-group">${await getProductionCompaniesDetails(tvShow.production_companies)}</div>
  </div>
</div>`;
  tvShowDetails.appendChild(div);
}

// Fetch production companies details
async function getProductionCompaniesDetails(companies) {
  const companyDetails = await Promise.all(
    companies.map(async (company) => {
      const companyData = await fetchData(`/company/${company.id}`);
      const imgSrc = companyData.logo_path
        ? `https://image.tmdb.org/t/p/w200${companyData.logo_path}`
        : '../images/no-image.jpg';
      // Add fallback URL
      return `<a class="company-link" href="${
        companyData.homepage || '#'
      }" target="_blank"><img class="company-logo" src='${imgSrc}'/> ${companyData.name}</a>`;
    })
  );
  return companyDetails.join('');
}

// Display slider movies
async function showNowPlaying() {
  showTrendMovies();
  const { results } = await fetchData('movie/now_playing');
  const swiper = document.querySelector('.swiper-wrapper');
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    const imgSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../images/no-image.jpg';
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      <img src="${imgSrc}" alt="${movie.title}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)} / 10
    </h4>`;
    swiper.appendChild(div);

    initSwiper();
  });
}

// Search for content
async function searchContent() {
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);

  global.search.type = urlParam.get('type');
  global.search.searchTerm = urlParam.get('search-term');

  if (global.search.searchTerm && global.search.searchTerm !== '') {
    const { results, total_pages, page, total_results } = await searchAPIData();
    const searchInput = document.querySelector('.search-term');

    global.search.page = page;
    global.search.totalPage = total_pages;
    global.search.totalResult = total_results;
    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

    displaySearchResults(results);

    const searchHeading = document.getElementById('search-results-heading');
    searchHeading.innerHTML = `
<h2>${results.length} of ${global.search.totalResult} results for '${global.search.searchTerm}' </h2>
`;

    searchInput.value = '';
  } else {
    showAlert('Please enter a search term');
  }
}

// Display search results
function displaySearchResults(results) {
  // Remove previous results
  const searchResult = document.getElementById('search-results');
  searchResult.innerHTML = '';
  // document.getElementById('search-results-heading').innerHTML = '';
  document.getElementById('pagination').innerHTML = '';

  results.forEach((result) => {
    const imgSrc = result.poster_path
      ? `https://image.tmdb.org/t/p/w300${result.poster_path}`
      : '../images/no-image.jpg';
    const div = document.createElement('div');
    div.setAttribute('class', 'card');
    div.innerHTML = `
        <a href="/pages/${global.search.type}-details.html?id=${result.id}"">
          <img src="${imgSrc}" class="card-img-top" alt="${
      global.search.type === 'movie' ? result.title : result.name
    }" />
        </a>
        <div class="card-body">
          <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${
              global.search.type === 'movie' ? result.release_date : result.first_air_date
            }</small>
          </p>
        </div>
    `;
    searchResult.appendChild(div);
  });

  // Update document title by query
  document.title = `'${global.search.searchTerm}' search results in ${
    global.search.type === 'movie' ? 'movies' : 'tv series'
  } | Cinematrix`;

  displayPagination();
}

// Show pagination
function displayPagination() {
  const paginationWrap = document.getElementById('pagination');
  const div = document.createElement('div');

  div.classList.add('pagination');
  div.innerHTML = ` <button class="btn btn-primary" id="prev">Prev</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPage}</div>
  <button class="btn btn-primary" id="next">Next</button>
  `;
  paginationWrap.appendChild(div);

  // Disable pagination buttons by checking the page number
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (global.search.page === 1) prevBtn.style.cssText = 'pointer-events:none;opacity:.6;';
  if (global.search.page === global.search.totalPage) nextBtn.style.cssText = 'pointer-events:none;opacity:.6;';

  // // Next page
  // nextBtn.addEventListener('click', async () => {
  //   global.search.page++;
  //   showSpinner();
  //   const { results, total_pages } = await searchAPIData();
  //   hideSpinner();
  //   displaySearchResults(results);

  //   // Scroll to the top of the page
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   });
  // });

  // // Prev page
  // prevBtn.addEventListener('click', async () => {
  //   global.search.page--;
  //   showSpinner();
  //   const { results, total_pages } = await searchAPIData();
  //   hideSpinner();
  //   displaySearchResults(results);
  //   // Scroll to the top of the page
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   });
  // });

  // ! UPDATE HEADING RESULT COUNT
  const navigatePage = async (direction) => {
    global.search.page += direction;
    showSpinner();
    const { results, total_pages } = await searchAPIData();
    hideSpinner();
    displaySearchResults(results);

    // Scroll smoothly to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Event listeners for next and previous buttons
  nextBtn.addEventListener('click', () => navigatePage(1));
  prevBtn.addEventListener('click', () => navigatePage(-1));
}

// Initialize swiper object
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 400,
    loop: true,
    freeMode: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Trending movies as background for slider
async function showTrendMovies() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;
  const response = await fetch(`${API_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  const { results } = data;
  const trendMovie = document.querySelector('.trending-movies');

  results.forEach((movie) => {
    const moviePoster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : '../images/no-image.jpg';
    const div = document.createElement('div');
    div.classList.add('trend-poster');
    div.innerHTML = `<img src='${moviePoster}' alt='${movie.title}'>`;
    trendMovie.appendChild(div);
  });

  showTrendTvSeries();

  // Call one more to increase the image count
  results.forEach((movie) => {
    const moviePoster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : '../images/no-image.jpg';
    const div = document.createElement('div');
    div.classList.add('trend-poster');
    div.innerHTML = `<img src='${moviePoster}' alt='${movie.title}'>`;
    trendMovie.appendChild(div);
  });

  showTrendTvSeries();
}

// Trending tv series as background for slider
async function showTrendTvSeries() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;
  const response = await fetch(`${API_URL}/trending/tv/day?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  const { results } = data;
  const trendMovie = document.querySelector('.trending-movies');

  results.forEach((movie) => {
    const moviePoster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : '../images/no-image.jpg';
    const div = document.createElement('div');
    div.classList.add('trend-poster');
    div.innerHTML = `<img src='${moviePoster}' alt='${movie.title}'>`;
    trendMovie.appendChild(div);
  });
}

// Make request to search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  // while data fecthing spinner display
  showSpinner();
  const response = await fetch(
    `${API_URL}/search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.searchTerm}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();

  return data;
}

// Fetch data from TMDB api
async function fetchData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

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

// Display alert box
function showAlert(message, className = 'alert-error') {
  const alertBox = document.getElementById('alert');
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  alertBox.appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
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
      showNowPlaying();
      break;
    case '/pages/movies.html':
      showUpcomingMovies();
      break;
    case '/pages/tv-shows.html':
      showPopularTvShows();
      break;
    case '/pages/tv-details.html':
      showTvShowDetails();
      break;
    case '/pages/movie-details.html':
      showMovieDetails();
      break;
    case '/pages/search.html':
      searchContent();
      showNowPlaying();
    default:
      break;
  }
  highlightLink();
}

document.addEventListener('DOMContentLoaded', initializeApp);
