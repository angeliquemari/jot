const $ = require('jquery');

const helpers = {
  selectTrip: function(e) {
    e.preventDefault();
    let tripId = e.target.getAttribute('tripid');
    let selectedTrip = this.state.trips.filter(trip => trip._id === tripId)[0];
    this.setState({
      selectedTrip: selectedTrip,
      selectedNote: (selectedTrip.notes.length) ? selectedTrip.notes[0] : undefined
    });
  },
  selectNote: function(e) {
    e.preventDefault();
    let noteId = e.target.getAttribute('noteid');
    let selectedNote = this.state.selectedTrip.notes.filter(note => note._id === noteId)[0];
    this.setState({selectedNote: selectedNote});
  },
  addTrip: function(e) {
    e.preventDefault();
    let tripName = prompt('Please enter a name for your trip:');
    if (tripName) {
      $.ajax({
        type: 'POST',
        url: '/trips',
        contentType: 'application/json',
        data: JSON.stringify({tripName: tripName}),
        success: () => {
          this.state.socket.emit('update');
          this.getTrips('latest trip, first note');
        }
      });
    }
  },
  deleteTrip: function(e) {
    e.preventDefault();
    $.ajax({
      type: 'DELETE',
      url: `/trips?trip=${this.state.selectedTrip._id}`,
      success: () => {
        this.state.socket.emit('update');
        this.getTrips('latest trip, first note');
      }
    });
  },
  addNote: function(e) {
    e.preventDefault();
    let title = prompt('Please enter a title for your note:');
    if (title) {
      $.ajax({
        type: 'POST',
        url: `/notes?trip=${this.state.selectedTrip._id}`,
        contentType: 'application/json',
        data: JSON.stringify({title: title, contents: ''}),
        success: () => {
          this.state.socket.emit('update');
          this.getTrips('same trip, last note');
        }
      });
    }
  },
  updateNote: function(e) {
    e.preventDefault();
    let contents = e.target.value;
    $.ajax({
      type: 'PATCH',
      url: `/notes?trip=${this.state.selectedTrip._id}&note=${this.state.selectedNote._id}`,
      contentType: 'application/json',
      data: JSON.stringify({contents: contents}),
      success: () => {
        this.state.socket.emit('update');
        this.getTrips('same trip, same note');
      }
    });
  },
  deleteNote: function(e) {
    e.preventDefault();
    $.ajax({
      type: 'DELETE',
      url: `/notes?trip=${this.state.selectedTrip._id}&note=${this.state.selectedNote._id}`,
      success: () => {
        this.state.socket.emit('update');
        this.getTrips('same trip, last note');
      }
    });
  }
}

export default helpers;
