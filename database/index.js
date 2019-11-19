const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jot', {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', function() {
  console.log('Mongoose connection error');
});
db.once('open', function() {
  console.log('Mongoose connected successfully');
});

const tripSchema = mongoose.Schema({
  username: String,
  tripName: String,
  notes: [ mongoose.Schema({title: String, contents: String}) ]
}, {timestamps: true});
const Trip = mongoose.model('Trip', tripSchema);

function getTrips(user) {
  return Trip.find(user).sort({updatedAt: -1}).exec(); // return trips by latest updated first
};

function createTrip(trip) {
  return Trip.create(trip);
};

function deleteTrip(tripId) {
  return Trip.findByIdAndDelete(tripId).exec();
}

function createNote(tripId, note) {
  return Trip.findByIdAndUpdate(tripId, {$push: {notes: note}}).exec();
};

function updateNote(tripId, noteId, note) {
  return Trip.updateOne({_id: tripId, 'notes._id': noteId}, {$set: {'notes.$.contents': note.contents}}).exec();
};

function deleteNote(tripId, noteId) {
  return Trip.findByIdAndUpdate(tripId, {$pull: {notes: {_id: noteId}}}).exec();
}

module.exports.getTrips = getTrips;
module.exports.createTrip = createTrip;
module.exports.deleteTrip = deleteTrip;
module.exports.createNote = createNote;
module.exports.updateNote = updateNote;
module.exports.deleteNote = deleteNote;
