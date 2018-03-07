// for loading environment variables and API keys
require('dotenv').load();
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const request = require('request');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

// connect to database
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'op2hpcwcbxb1t4z9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'k2o18d4ya99uzyhp',
  password : 'u13ezjlimaom89fl',
  database : 'w41eapf3atib4eph'
});
connection.connect();

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
    var selectQuery = 'SELECT search FROM `users` WHERE `cookie` = ' + connection.escape(req.query.userID);
    connection.query(selectQuery, function(err, rows, fields) {
      if (err) { throw(err); }
      else {
        var result = [];
        for (var i = 0; i < rows.length; i++) {
          result.unshift(rows[i].search);
        }
        res.send(result);
      }
    });
  });

  // "/setSearchHistory" is a post request which updates the user's search
  // history in the database, given the unique user id and the most recent search
  app.post('/setSearchHistory', function (req, res) {
    var search = req.query.search;
    var cookie = req.query.userID;
    // delete any records that are duplicates of the most recent search
    var deleteQuery = 'DELETE FROM `users` WHERE `cookie` = ' + connection.escape(cookie) + ' AND `search` = ' + connection.escape(search);
    connection.query(deleteQuery, function(err, rows, fields) {
      if (err) { throw(err); }
    });
    var insertQuery = 'INSERT INTO `users` (cookie, search) VALUES (' + connection.escape(cookie) + ', ' + connection.escape(search) + ')';
    connection.query(insertQuery, function(err, rows, fields) {
      if (err) { throw(err); }
    });
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
