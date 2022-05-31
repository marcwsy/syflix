
// global variables
const modal = document.querySelector('.modal-container');
const addBtn = document.getElementById('addMovieBtn');
const closeBtn = document.getElementById('closeModal');
const movieForm = document.getElementById('data');
const movieList = document.querySelector('.movie-list');
const table = document.querySelector('.movie-table');
const errorMsg = document.querySelector('.error-msg');
const showingTitle = document.querySelector('.showing');
const sortTitleBtn = document.getElementById('sortTitle');
const sortRatingBtn = document.getElementById('sortRating');

// event listeners
addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
movieForm.addEventListener('submit', addMovieToTable);
sortTitleBtn.addEventListener('click', sortTitle);
sortRatingBtn.addEventListener('click', sortRating);

// modal functions
function openModal() {
    modal.classList.add('active');
    movieForm.reset();
}

function closeModal() {
    modal.classList.remove('active');
    errorMsg.classList.remove('active');
    errorMsg.textContent = '';
}

// classes
class Movie {
    constructor(
        title = 'blank',
        director = 'blank',
        rating = '0',
    ){
        this.title = title
        this.director = director
        this.rating = rating
    }
}

class MovieLibrary {
    constructor() {
        this.movies = []
    }
  
    addMovie(newMovie) {
        if (!this.isInLibrary(newMovie)) {
            this.movies.push(newMovie)
        }
    }
  
    removeMovie(title) {
        this.movies = this.movies.filter((movie) => movie.title !== title)
    }
  
    isInLibrary(newMovie) {
        return this.movies.some((movie) => movie.title === newMovie.title)
    }
}

const movieLibrary = new MovieLibrary()

function toTitleCase(string) {
    return string.replace(/\w\S*/g, function(text){
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
}

// creating objects and updating the DOM from user input
function addMovieInput() {
    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const rating = document.getElementById('rating').value;
    return new Movie(toTitleCase(title), toTitleCase(director), parseInt(rating));
}

function addMovieToTable(e) {
    e.preventDefault();
    const newMovie = addMovieInput();

    if (movieLibrary.isInLibrary(newMovie)) {
        errorMsg.textContent = 'this movie already exists in your library';
        errorMsg.classList.add('active');
        return
    } else {
        movieLibrary.addMovie(newMovie);
        updateTable();
        saveToLocal();
        titleCounter();
    }
    closeModal();
}

// create row in dom
function createTable(movie) {
    const movieTable = document.createElement('li');
    const title = document.createElement('p');
    const director = document.createElement('p');
    const rating = document.createElement('p');
    const star = document.createElement('p');
    const tableButton = document.createElement('div');
    const ratingGrp = document.createElement('div');
    const deleteRow = document.createElement('button');

    movieTable.classList.add('movie-row');
    movieTable.classList.add('active');
    tableButton.classList.add('button-group');
    deleteRow.classList.add('btn');
    deleteRow.classList.add('btn-outline-danger');
    ratingGrp.classList.add('rating-group');
    rating.classList.add('rating');
    title.classList.add('titles');
    star.classList.add('star');
    director.classList.add('directors');
    title.textContent = movie.title;
    director.textContent = movie.director;
    rating.textContent = `${movie.rating}`;
    star.textContent = '⭐️';
    deleteRow.textContent = 'delete';
    deleteRow.onclick = removeMovie;
    
    movieTable.appendChild(title);
    movieTable.appendChild(director);
    movieTable.appendChild(ratingGrp);
    ratingGrp.appendChild(star);
    ratingGrp.appendChild(rating);
    movieTable.appendChild(tableButton);
    movieList.appendChild(movieTable);
    tableButton.appendChild(deleteRow);
}

function resetBody() {
    movieList.innerHTML = '';
}

function updateTable() {
    resetBody();
    for (let movie of movieLibrary.movies) {
        createTable(movie);
    }
    titleCounter()
}

// updates showing titles
function titleCounter() {
    const list = document.getElementsByTagName('li');
    let libLength = 0;
    if (list === null) {
    } else {
        for (let i = 0; i < (list.length + 1); i++) {
            libLength = i;
        }
        return showingTitle.textContent = `Showing ${libLength} titles`;
    }
}

// saves to local storage
window.onchange = restoreLocal();
function saveToLocal() {
    localStorage.setItem('movieLibrary', JSON.stringify(movieLibrary.movies));
}

function restoreLocal() {
    const movies = JSON.parse(localStorage.getItem('movieLibrary'));
    (movies) ? movieLibrary.movies = movies.map((movie) => JSONToMovie(movie)) : movieLibrary.movies = [];
    updateTable();
}

function JSONToMovie(movie) {
    return new Movie(movie.title, movie.director, parseInt(movie.rating));
}

function removeMovie(e) {
    const title = e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll("", '');
    movieLibrary.removeMovie(title);
    saveToLocal();
    updateTable();
    titleCounter()
}

// simple search function from W3schools including updates to showing titles
function searchBar() {
    const input = document.getElementById('searchInput');
    const row = document.getElementById('movieList');
    const list = row.getElementsByTagName('li');
    let filter = input.value.toUpperCase();
    
    for (let i = 0; i < list.length; i++) {
        let pTitle = list[i].getElementsByTagName('p')[0];
        let pDirector = list[i].getElementsByTagName('p')[1];
        const titleTextValue = pTitle.textContent || pTitle.innerText;
        const directorTextValue = pDirector.textContent || pDirector.textContent;
        console.log(list[i]);
        if (titleTextValue.toUpperCase().indexOf(filter) > -1) {
            list[i].style.display = '';
            list[i].classList.add('active');
        } else if (directorTextValue.toUpperCase().indexOf(filter) > -1) {
            list[i].style.display = '';
            list[i].classList.add('active');
        } else {
            list[i].classList.remove('active');
        }
    }
    const actives = document.getElementsByClassName('active');
    console.log(actives);
    let libLength = 0;
    if (actives === null) {
    } else {
        for (let i = 0; i < (actives.length + 1); i++) {
            libLength = i;
        }
        return showingTitle.textContent = `Showing ${libLength} titles`;
    }
}

// sorting functions for titles and ratings. title sorting from W3schools
function sortRating() {
    const list = document.getElementById('movieList');
    let items = Array.from(list.querySelectorAll('.movie-row'));
    items.sort((a,b)=>{
        const [ratA, ratB] = [a,b].map(el => el.querySelector('.rating').textContent)
        return ratB - ratA;// descending sort
    });
    
    items.forEach(el => list.append(el))
}

function sortTitle() {
        var list, i, switching, b, shouldSwitch;
        list = document.getElementById("movieList");
        switching = true;
        while (switching) {
          switching = false;
          b = list.getElementsByTagName("LI");
          for (i = 0; i < (b.length - 1); i++) {
            shouldSwitch = false;
            if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
          if (shouldSwitch) {
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
          }
        }
}

