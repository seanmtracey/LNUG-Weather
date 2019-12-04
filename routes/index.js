const debug = require('debug')('index.js');
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

debug('meow');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GIF WEVVA' });
});

function getGif(query){

  return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${query}`)
    .then(response => {
      if(response.ok){
        return response.json();
      } else {
        throw response;
      }
    })
    .then(R => {
      // debug(R);
      return R.data;
    })
  ;

}

router.get('/wevva', (req, res) => {
  
  //debug(req.query);

  debug(`https://api.weatherbit.io/v2.0/current?lat=${req.query.latitude}&lon=${req.query.longitude}&key=${process.env.WEATHER_API_KEY}`);

  fetch(`https://api.weatherbit.io/v2.0/current?lat=${req.query.latitude}&lon=${req.query.longitude}&key=${process.env.WEATHER_API_KEY}`)
    .then(response => {
      if(response.ok){
        return response.json();
      } else {
        throw response;
      }
    })
    .then(data => {
      debug(data.data[0].weather );

      const weatherDescription = data.data[0].weather.description;
      let temperature;

      if(data.data[0].temp < 0){
        temperature = "freezing";
      }

      if(data.data[0].temp >= 0){
        temperature = "cold";
      }

      if(data.data[0].temp > 10){
        temperature = "fine"
      }

      if(data.data[0].temp > 20){
        temperature = "toasty"
      }

      if(data.data[0].temp > 30){
        temperature = "hell";
      }

      debug(weatherDescription, temperature);

      const Gifs = [];

      Gifs.push(getGif(weatherDescription));
      Gifs.push(getGif(temperature));

      return Promise.all(Gifs);

    })
    .then(Gifs => {

      debug(Gifs);

      const weatherGif = Gifs[0][Math.random() * Gifs[0].length | 0].images.downsized_large.url;
      const tempGif = Gifs[1][Math.random() * Gifs[1].length | 0].images.downsized_large.url;

      debug("weather:", weatherGif);
      debug("temp:", tempGif);

      res.render('wevva', {
        weather : weatherGif,
        temperature : tempGif
      });

    })
    .catch(err => {
      debug('err:', err);
      res.status(500);
      res.end();
    })

});

module.exports = router;
