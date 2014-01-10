var scraper = require('./scraper.js'),
    fs = require("fs");

var actorData =[];

// **************************************************************************
// IMPORT THE FILMS DATA FROM FILMS.JS
// **************************************************************************
fs.readFile('temp/films.json', 'utf8', function (err, filmsJSON) {
  var films = JSON.parse(filmsJSON);
  step(films.shift(), films);
});

// **************************************************************************
// STEP THROUGH EACH FILM, PROCESSING ONE RECORD AT A TIME
// This loop goes to wikipedia directly to get an array of actors.  This is
// done because the dbpedia data has a lot of gaps.  If the film has no wiki
// page it is skipped, these are small short films and documentaries that are
// not needed in this case.  I just want the major films for each director.
// **************************************************************************
function step(film, list) {
  if(film) {
    if (film.wiki) {
      scraper.scrapeActors(film.wiki, function(result) {
        console.log("PROCESSING: ", film.name, "RECS: ", result.length);
        film['stars'] = result;
        if (result.length > 0) actorData.push(film);
        return step(list.shift(), list);
      });
    } else{
      step(list.shift(), list);
    }
  } else {
    return scraper.writeFile('temp/actors.json', actorData);
  }
}