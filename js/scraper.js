var request = require('request'),
    cheerio = require('cheerio'),
    fs = require("fs");

module.exports =  {
  scrapeDirector: function (item, callback) {
    var rec = {};
    request(item, function (error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        rec['name'] = cleanText($('#title a').text());
        rec['link'] = item;
        rec['description'] = $('#content > p').first().text();
        getSet($, 'a[rev="dbpedia-owl:director"]', function (result) {
          rec['directed'] = result;
        });
        getSet($, 'a[rev="dbpedia-owl:producer"]', function (result) {
          rec['produced'] = result;
        });
        callback(rec);
      } else{
        console.log("HTML Load Error: " + error )
      }
    });
  },
  scrapeActors: function (item, callback) {
    var rec = [];
    request(item, function (error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);

        var infobx = $('.infobox.vevent').first();
        var actors = $(infobx).find('th:contains("Starring")').parent().find('td').text();

        actors.replace(/,/g,"").split("\n").forEach(function(name){
            if (name != "") rec.push(name)
        });
        callback(rec);
       } else{
        console.log("HTML Load Error: " + error )
      }
    });
  },
  scrapeFilm: function (item, callback) {
    var rec = {};
    request(item, function (error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        rec['name'] = cleanText($('#title a').text());
        rec['link'] = item;
        rec['wiki'] = $('a[rev="foaf:primaryTopic"]').text();
        rec['description'] = $('#content > p').first().text();
        rec['budget'] = $('span[property="dbpedia-owl:budget"]').text();
        rec['gross'] = $('span[property="dbpedia-owl:gross"]').text();
        getSet($, 'a[rel="dbpedia-owl:producer"]', function (result) {
          rec['producer'] = result;
        });
        getSet($, 'a[rel="dbpedia-owl:starring"]', function (result) {
          rec['actors'] = result;
        });
        getSet($, 'a[rel="dcterms:subject"]', function (result) {
          rec['subjects'] = result;
        });
        getSet($, 'a[rel="rdf:type"]', function (result) {
          rec['types'] = result;
        });
        callback(rec);
      } else{
        console.log("HTML LOAD Error: " + error )
      }
    });
  },
  writeFile: function (path, data) {
    fs.writeFile(path, JSON.stringify(data), function(err) {
      if(err) {
        console.log("File Save Error: " + err); 
      } else {
        console.log(path + " saved");
      }
    });
  }
}

function cleanText(text) {
  return text.replace(/_/g, " ")
             .replace(/^dbpedia:/, "")
             .replace(/^ /, "")
             .replace(/\(.*\)/, "")
             .replace(/ $/, "");
}

function getSet($, selector, callback) {
  var set = [];
  $(selector).each(function(){
    set.push({label: cleanText(this.text()), name: this.text(), link: this.attr('href')});
  });
 callback(set);
}






