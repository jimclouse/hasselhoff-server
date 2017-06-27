'use strict';
const express      = require('express')
const http         = require('http')
const mssql        = require('./mssql');
const bodyParser   = require('body-parser');
const app = express();

const _port = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(  function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9090')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/healthcheck', function(req, res) {
  return res.sendStatus(200);
});

app.post('/query', mssql.query);

const server = http.createServer(app);

server.listen(_port, function() {
  console.log("running on port " + _port);
  return console.log("App settings:", app.locals);
});

module.exports = app;
