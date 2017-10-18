// Instastore
// database/server.js
// Anthony Krivonos
// 10/16/2017

// Global Imports
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Local Imports
const environment = require('../environment.js');
const file = require('./file.js');

// Local Variables
let port = process.env.PORT || environment.database.port || '8082';

app.use(bodyParser.json());

app.post('/create/:file*', function (req, res) {
      let params = req.params, address = (req.params["0"] || " ").substring(1), body = req.body;
      if (params.file == null)
            return res.status(500).send('Invalid URI for CREATE operation.');
      else if (body == null)
            return res.status(500).send('Invalid body for CREATE operation.');
      file.create(params.file, address, body).then((r) => {
            res.status(200).json(r);
      }).catch(() => {
            res.status(500).send('Error executing CREATE operation.');
      });
});

// Read Function
app.get('/read/:file/', function (req, res) {
      let params = req.params;
      if (params.file == null)
            return res.status(500).send('Invalid URI for READ operation.');
      file.read(params.file).then((r) => {
            res.status(200).json(r)
      }).catch(() => {
            res.status(500).send('Error executing READ operation.');
      });
});
app.get('/read/:file*', function (req, res) {
      let params = req.params, address = (req.params["0"] || "").substring(1);
      if (params.file == null || address == null)
            return res.status(500).send('Invalid URI for READ operation.');
      file.read(params.file, address).then((r) => {
            res.status(200).json(r)
      }).catch(() => {
            res.status(500).send('Error executing READ operation.');
      });
});

// Update Function
app.post('/update/:file*', function (req, res) {
      let params = req.params, address = (req.params["0"] || " ").substring(1), body = req.body;
      if (params.file == null)
            return res.status(500).send('Invalid URI for UPDATE operation.');
      else if (body == null)
            return res.status(500).send('Invalid body for UPDATE operation.');
      file.update(params.file, address, body).then((r) => {
            res.status(200).json(r)
      }).catch(() => {
            res.status(500).send('Error executing UPDATE operation.');
      });
});

// Delete Function
app.get('/delete/:file*', function (req, res) {
      let params = req.params, address = (req.params["0"] || " ").substring(1);
      if (params.file == null)
            return res.status(500).send('Invalid URI for DELETE operation.');
      file.del(params.file, address).then((r) => {
            res.status(200).json(r);
      }).catch(() => {
            res.status(500).send('Error executing DELETE operation.');
      })
});

// Port Listener
app.listen(port, () => {
      console.log(`Instastore client listening on port ${port}.`);
});
