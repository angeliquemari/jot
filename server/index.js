const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(express.static('./client/dist'));
app.use(express.json());
app.use(morgan('dev'));
const db = require('../database/index.js');
const USERNAME = 'angeliquemari';

app.get('/trips', (req, res) => {
  db.getTrips({username: USERNAME})
    .then((trips) => {
      res.send(trips);
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).end();
    });
});

app.post('/trips', (req, res) => {
  db.createTrip({username: USERNAME, tripName: req.body.tripName})
    .then(() => {
      res.end();
    })
    .catch((err) =>{
      console.log('Error:', err);
      res.status(500).end();
    });
});

app.post('/notes', (req, res) => {
  db.createNote(req.query.trip, req.body)
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).end();
    });
});

app.patch('/notes', (req, res) => {
  db.updateNote(req.query.trip, req.query.note, req.body)
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).end();
    });
});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
