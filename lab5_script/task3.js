// Task 3: Movie Collection Manager
const movies = [];

function addMovie(title, director, genre, year) {
  movies.push({ title, director, genre, year });
}

function listMovies() {
  return movies
    .map((m, i) => `${i + 1}. ${m.title} (${m.year}) - ${m.director} [${m.genre}]`)
    .join("\n");
}

function searchByDirector(director) {
  const key = director.toLowerCase();
  return movies.filter((m) => m.director.toLowerCase() === key);
}

function searchByGenre(genre) {
  const key = genre.toLowerCase();
  return movies.filter((m) => m.genre.toLowerCase() === key);
}

addMovie("Inception", "Christopher Nolan", "Sci-Fi", 2010);
addMovie("Interstellar", "Christopher Nolan", "Sci-Fi", 2014);
addMovie("Parasite", "Bong Joon-ho", "Thriller", 2019);
console.log(listMovies());
console.log("By director:", searchByDirector("christopher nolan"));
console.log("By genre:", searchByGenre("SCI-FI"));
