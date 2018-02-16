// for loading environment variables and API keys
require('dotenv').load();
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

// intialize persistent storage for user search history
const storage = require('node-persist');
storage.initSync({ttl: 1000*60*60*24*365});

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  app.use(cors());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Forecast API requests
  app.get('/forecastApi', function (req, res) {
    const url = "https://api.darksky.net/forecast/" + process.env.FORECAST_KEY + "/" + req.query.coords + "?exclude=flags";
    request(url, { json: true }, (err, response, body) => {
      if (err) { return console.log(err); }
      res.send(body);
    });
  });

  app.get('/futureForecastApi', function (req, res) {
    const url = "https://api.darksky.net/forecast/" + process.env.FORECAST_KEY + "/" + req.query.coords + "?exclude=currently,minutely,hourly,flags";
    request(url, { json: true }, (err, response, body) => {
      if (err) { return console.log(err); }
      res.send(body);
    });
  });

  // historical forecast info
  app.get('/historicalForecastApi', function (req, res) {
    const url = "https://api.darksky.net/forecast/" + process.env.FORECAST_KEY + "/" + req.query.coords + "," + req.query.time + "?exclude=currently,minutely,hourly,flags";
    request(url, { json: true }, (err, response, body) => {
      if (err) { return console.log(err); }
      res.send(body);
    });
  });

  // Search History API requests

  // "/getSearchHistory" is a get request which retrieves the user's search
  // history, given the unique user id provided by the client (browser)
  app.get('/getSearchHistory', function (req, res) {
    storage.getItem(req.query.userID).then(function(result) {
      if (result === undefined) {
        res.send([]);
      } else {
        res.send(result);
      }
    });
  });

  // for parsing data in body of /setSearchHistory requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // "/setSearchHistory" is a post request which updates the user's search
  // history, given the unique user id and the updated search history array
  app.post('/setSearchHistory', function (req, res) {
    // get body of request
    var updatedSearchHistory = req.body.history;
    storage.setItem(req.query.userID, updatedSearchHistory);
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
