import React from 'react';
import styles from './styles/app.css';
import $ from 'jquery';
import io from 'socket.io-client';
import Trips from './Trips';
import Notes from './Notes';
import Note from './Note';
const socket = io.connect('http://localhost:3000');
socket.on('connect', () => {
  console.log('Connected to socket');
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      selectedTrip: undefined,
      selectedNote: undefined
    };
    this.selectTrip = this.selectTrip.bind(this);
    this.selectNote = this.selectNote.bind(this);
    this.addTrip = this.addTrip.bind(this);
    this.addNote = this.addNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
  }

  selectTrip(e) {
    e.preventDefault();
    let tripId = e.target.getAttribute('tripid');
    let selectedTrip = this.state.trips.filter(trip => trip._id === tripId)[0];
    this.setState({
      selectedTrip: selectedTrip,
      selectedNote: (selectedTrip.notes.length) ? selectedTrip.notes[0] : undefined
    });
  }

  selectNote(e) {
    e.preventDefault();
    let noteId = e.target.getAttribute('noteid');
    let selectedNote = this.state.selectedTrip.notes.filter(note => note._id === noteId)[0];
    this.setState({selectedNote: selectedNote});
  }
  
  addTrip(e) {
    e.preventDefault();
    let tripName = prompt('Please enter a name for your trip:');
    if (tripName) {
      $.ajax({
        type: 'POST',
        url: '/trips',
        contentType: 'application/json',
        data: JSON.stringify({tripName: tripName}),
        success: () => {
          socket.emit('update');
          this.getTrips('latest trip, first note');
        }
      });
    }
  }

  addNote(e) {
    e.preventDefault();
    let title = prompt('Please enter a title for your note:');
    if (title) {
      $.ajax({
        type: 'POST',
        url: `/notes?trip=${this.state.selectedTrip._id}`,
        contentType: 'application/json',
        data: JSON.stringify({title: title, contents: ''}),
        success: () => {
          socket.emit('update');
          this.getTrips('same trip, last note');
        }
      });
    }
  }

  updateNote(e) {
    e.preventDefault();
    let contents = e.target.value;
    $.ajax({
      type: 'PATCH',
      url: `/notes?trip=${this.state.selectedTrip._id}&note=${this.state.selectedNote._id}`,
      contentType: 'application/json',
      data: JSON.stringify({contents: contents}),
      success: () => {
        socket.emit('update');
        this.getTrips('same trip, same note');
      }
    });
  }

  getTrips(filter) {
    // check filter valid
    if (!['same trip, same note', 'same trip, last note', 'latest trip, first note'].includes(filter)) throw 'filter not valid';
    if (this.state.selectedTrip === undefined) filter = 'latest trip, first note';
    // get trips data to set state
    $.get('/trips', (trips) => {
      // set selectedTrip & selectedNote based on passed-in filter
      let selectedTrip;
      let selectedNote;
      if (filter === 'same trip, same note' || filter === 'same trip, last note') {
        let selectedTripArr = trips.filter(trip => trip._id === this.state.selectedTrip._id);
        if (selectedTripArr.length) {
          selectedTrip = selectedTripArr[0];
          let selectedNoteArr;
          if (filter === 'same trip, same note') {
            if (this.state.selectedNote === undefined) {
              filter = 'same trip, last note';
            } else {
              selectedNoteArr = (selectedTrip.notes.length) ? selectedTrip.notes.filter(note => note._id === this.state.selectedNote._id) : [];
            }
          }
          if (filter === 'same trip, last note') {
            selectedNoteArr = (selectedTrip.notes.length) ? [selectedTrip.notes[selectedTrip.notes.length - 1]] : [];
          }
          if (selectedNoteArr.length) {
            selectedNote = selectedNoteArr[0];
          } else {
            selectedNote = undefined;
          }
        } else { // if trip not found, set default selection
          filter = 'latest trip, first note';
        }
      }
      if (filter === 'latest trip, first note') { // default selection
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

  componentDidMount() {
    socket.on('update', () => {
      console.log('Received an update signal');
      this.getTrips('same trip, same note');
    });
    this.getTrips('latest trip, first note');
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.mainHeader}>
          <div className={styles.appTitle}>jot</div>
          <div className={styles.appDescription}>Travel notes</div>
        </div>
        <div className={styles.mainBody}>
          <Trips trips={this.state.trips} addTrip={this.addTrip} selectTrip={this.selectTrip} selectedTrip={this.state.selectedTrip} />
          <div className={styles.rightSide}>
            {this.state.selectedTrip !== undefined && <Notes notes={this.state.selectedTrip.notes} addNote={this.addNote} selectNote={this.selectNote} selectedNote={this.state.selectedNote} />}
            {this.state.selectedTrip !== undefined && this.state.selectedNote !== undefined && <Note note={this.state.selectedNote} updateNote={this.updateNote} />}
          </div>
        </div>
      </div>
    );
  }
}
