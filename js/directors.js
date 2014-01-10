var scraper = require('./scraper.js'),
    fs = require("fs");

var dirData = [];

var directors = [
  'http://dbpedia.org/page/Stanley_Kubrick',
  'http://dbpedia.org/page/Martin_Scorsese',
  'http://dbpedia.org/page/Steven_Spielberg',
  'http://dbpedia.org/page/Quentin_Tarantino'];

// **************************************************************************
// SCRAPE EACH OF THE DIRECTORS LISTED ABOVE - ITEMS SCRAPED IN PARALLEL
// **************************************************************************
directors.forEach(function(item) {
  scraper.scrapeDirector(item, function(result){
    console.log("Processing: ", item)
    dirData.push(result);
    if(dirData.length == directors.length) {
      scraper.writeFile('temp/directors.json', dirData);
    }
  })
});
