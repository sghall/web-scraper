var fs = require("fs");

var keys ={}; nodes = [], links = [];

// ******************************************************************************
// THIS FILE TAKES DATA FROM ACTOR.JS AND CREATES THE NODES AND LINKS FOR THE VIZ
// ******************************************************************************
fs.readFile('temp/actors.json', 'utf8', function (err, filmsJSON) {
  var films = JSON.parse(filmsJSON);

  films.forEach(function (film, i) {
    if (!keys[film.name]) {
      keys[film.name] = {name: film.name, type: 'film', director: film.director};
      nodes.push(keys[film.name]);
    }
    if (!keys[film.director]) {
      keys[film.director] = {name: film.director, type: 'director'};
      nodes.push(keys[film.director]);
    }
    film.stars.forEach(function (actor) {
      if (!keys[actor]) {
        keys[actor] = {name: actor, type: 'actor'};
        nodes.push(keys[actor]);
      }
    });
  });

  function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
          if(array[i][attr] === value) {
              return i;
          }
      }
  }

  films.forEach(function (film) {
    var dirIndex = findWithAttr(nodes, 'name', film.director );
    var filmIndex = findWithAttr(nodes, 'name', film.name );
    links.push({source: dirIndex, target: filmIndex});
    film.stars.forEach(function (actor) {
      var actorIndex = findWithAttr(nodes, 'name', actor);
      links.push({source: actorIndex, target: filmIndex});
    })
  });

  fs.writeFile('../data/films.json', JSON.stringify({nodes: nodes, links: links}), function(err) {
    if(err) {
      console.log("File Save Error: " + err); 
    } else {
      console.log("saved");
    }
  });
});
