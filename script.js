
const modal = document.querySelector('.modal-container');
const addBtn = document.getElementById('addMovieBtn');
const closeBtn = document.getElementById('closeModal');
const movieForm = document.getElementById('data');
const movieList = document.querySelector('.movie-list');
const table = document.querySelector('.movie-table');
const errorMsg = document.querySelector('.error-msg');
const showingTitle = document.querySelector('.showing');


function openModal() {
    modal.classList.add('active');
    movieForm.reset();
}

function closeModal() {
    modal.classList.remove('active');
    errorMsg.classList.remove('active');
    errorMsg.textContent = '';
}

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
movieForm.addEventListener('submit', addMovieToTable);

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

function addMovieInput() {
    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const rating = document.getElementById('rating').value;
    return new Movie(title, director, parseFloat(rating));
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


function titleCounter() {
    const movies = JSON.parse(localStorage.getItem('movieLibrary'));
    let libLength = 0;
    for (let i = 0; i < movies.length; i++) {
        libLength = i;
    }
    return showingTitle.textContent = `Showing ${libLength} titles`;
}


function saveToLocal() {
    localStorage.setItem('movieLibrary', JSON.stringify(movieLibrary.movies));
}

function restoreLocal() {
    const movies = JSON.parse(localStorage.getItem('movieLibrary'));
    (movies) ? movieLibrary.movies = movies.map((movie) => JSONToMovie(movie)) : movieLibrary.movies = [];
    updateTable();
}

window.onchange = restoreLocal();

function JSONToMovie(movie) {
    return new Movie(movie.title, movie.director, parseFloat(movie.rating));
}

function removeMovie(e) {
    const title = e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll("", '');
    movieLibrary.removeMovie(title);
    saveToLocal();
    updateTable();
    titleCounter()
}

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

        if (titleTextValue.toUpperCase().indexOf(filter) > -1) {
            list[i].style.display = '';
        } else if (directorTextValue.toUpperCase().indexOf(filter) > -1) {
            list[i].style.display = '';
        } else {
            list[i].style.display = 'none';
        }
    }
}

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
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
          // Start by saying: no switching is done:
          switching = false;
          b = list.getElementsByTagName("LI");
          // Loop through all list items:
          for (i = 0; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should
            switch place with the current item: */
            if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
              /* If next item is alphabetically lower than current item,
              mark as a switch and break the loop: */
              shouldSwitch = true;
              break;
            }
          }
          if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
          }
        }
}

const sortTitleBtn = document.getElementById('sortTitle');
const sortRatingBtn = document.getElementById('sortRating');
sortTitleBtn.addEventListener('click', sortTitle);
sortRatingBtn.addEventListener('click', sortRating);

