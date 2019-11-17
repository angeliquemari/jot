const express = require('express');
const app = express();
app.use(express.static('./client/dist'));
app.use(express.json());
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
  var tripId = req.query.trip;
  var title = req.body.title;
  var contents = req.body.contents;
  // add note for trip to db
  res.end();
});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
