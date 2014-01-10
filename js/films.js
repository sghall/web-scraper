var scraper = require('./scraper.js'),
    fs = require("fs");

var filmData = [];

// **************************************************************************
// USE THE OUTPUT FROM DIRECTORS.JS TO CREATE UNIQUE LIST OF FILMS
// **************************************************************************
fs.readFile('temp/directors.json', 'utf8', function (err, directorJSON) {
  var filmArray = [], directors = JSON.parse(directorJSON);

  directors.forEach(function(director) {
    director.directed.forEach(function(film) {
      if (filmArray.indexOf(film.link) === -1) {
        filmArray.push({director: director.name, link: film.link});
      }
    });
  });
  // INVOKE THE STEP FUNCTION WITH FIRST FILM
  step(filmArray.shift(), filmArray);
});

// **************************************************************************
// STEP THROUGH EACH FILM, PROCESSING ONE RECORD AT A TIME
// **************************************************************************
function step(film, list) {
  if(film) {
    console.log("PROCESSING: ", film.link)
    scraper.scrapeFilm(film.link, function(result) {
      result['director'] = film.director;
      filmData.push(result);
      return step(list.shift(), list);
    });
  } else {
    return scraper.writeFile('temp/films.json', filmData);
  }
}
