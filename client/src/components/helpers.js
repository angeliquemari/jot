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
    let cursorPosition = e.target.selectionStart;

    $.ajax({
      type: 'PATCH',
      url: `/notes?trip=${this.state.selectedTrip._id}&note=${this.state.selectedNote._id}`,
      contentType: 'application/json',
      data: JSON.stringify({contents: contents}),
      success: () => {
        this.state.socket.emit('update');
        this.setState({cursorPosition: cursorPosition}, this.getTrips('same trip, same note'));
      }
    });
  },
  setCursorPosition: function() {
    if (this.state.cursorPosition) {
      this.noteTextArea.current.selectionStart = this.state.cursorPosition;
      this.noteTextArea.current.selectionEnd = this.state.cursorPosition;
    }
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
  },
  getTrips: function(filter) {
    // check filter valid
    if (!['same trip, same note', 'same trip, last note', 'latest trip, first note'].includes(filter)) throw 'filter not valid';
    // get trips data to set state
    $.get('/trips', (trips) => {
      // set selectedTrip & selectedNote based on passed-in filter
      let selectedTrip;
      let selectedNote;
      if (this.state.selectedTrip === undefined) filter = 'latest trip, first note'; // handle another client adding trip
      if (filter === 'same trip, same note' || filter === 'same trip, last note') {
        let selectedTripArr = trips.filter(trip => trip._id === this.state.selectedTrip._id);
        if (selectedTripArr.length) {
          selectedTrip = selectedTripArr[0];
          let selectedNoteArr;
          if (filter === 'same trip, same note') {
            if (this.state.selectedNote === undefined) {
              filter = 'same trip, last note';
            }
            if (selectedTrip.notes.length) {
              let selectedNoteArr = selectedTrip.notes.filter(note => note._id === this.state.selectedNote._id);
              if (selectedNoteArr.length) {
                selectedNote = selectedNoteArr[0]; // same note as before
              } else { // handle another client deleting note
                filter = 'same trip, last note';
              }
            } else { // handle another client deleting only note
              selectedNote = undefined;
            }
          }
          if (filter === 'same trip, last note') {
            selectedNoteArr = (selectedTrip.notes.length) ? [selectedTrip.notes[selectedTrip.notes.length - 1]] : [];
            if (selectedNoteArr.length) {
              selectedNote = selectedNoteArr[0]; // trip's last note
            } else {
              selectedNote = undefined; // trip has no notes
            }
          }
        } else { // handle another client deleting trip
          filter = 'latest trip, first note';
        }
      }
      if (filter === 'latest trip, first note') { // default filter
        selectedTrip = (trips.length) ? trips[0] : undefined;
        selectedNote = (trips.length && trips[0].notes.length) ? trips[0].notes[0] : undefined;
      }
      this.setState({
        trips: trips,
        selectedTrip: selectedTrip,
        selectedNote: selectedNote
      });
    });
  }
}

export default helpers;
