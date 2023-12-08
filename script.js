// Selecting elements from the DOM
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Function to load movies from the OMDB API
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
}

// Function to find movies based on user input
function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// Function to display the list of movies in the search container
function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        // Create a new div for each movie
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // Setting movie id in data-id
        movieListItem.classList.add('search-list-item');
        // Set the movie poster or use a default image if not available
        let moviePoster = (movies[idx].Poster != "N/A") ? movies[idx].Poster : "image_not_found.png";
        // Add HTML content to the movie div
        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        // Append the movie div to the search list
        searchList.appendChild(movieListItem);
    }
    // Load movie details when a search result is clicked
    loadMovieDetails();
}

// Function to load and display detailed information about a selected movie
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            // Fetch detailed information about the selected movie
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // Display the detailed movie information
            displayMovieDetails(movieDetails);
        });
    });
}

// Function to display detailed movie information in the result container
function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors: </b>${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

// Close the search list when clicking outside the search box
window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});
