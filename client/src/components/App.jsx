import React from 'react';
import styles from './styles/app.css';
import $ from 'jquery';
import io from 'socket.io-client';
import Trips from './Trips';
import Notes from './Notes';
import Note from './Note';
import helpers from './helpers.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      selectedTrip: undefined,
      selectedNote: undefined,
      socket: undefined
    };
    this.addTrip = helpers.addTrip.bind(this);
    this.selectTrip = helpers.selectTrip.bind(this);
    this.selectNote = helpers.selectNote.bind(this);
    this.deleteTrip = helpers.deleteTrip.bind(this);
    this.addNote = helpers.addNote.bind(this);
    this.updateNote = helpers.updateNote.bind(this);
    this.deleteNote = helpers.deleteNote.bind(this);
  }

  getTrips(filter) {
    // check filter valid
    if (!['same trip, same note', 'same trip, last note', 'latest trip, first note'].includes(filter)) throw 'filter not valid';
    if (this.state.selectedTrip === undefined) filter = 'latest trip, first note'; // handle another client adding trip
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
            if (this.state.selectedNote === undefined) { // handle another client adding note, or still no notes
              filter = 'same trip, last note';
            } else { // get same note, or handle another client deleting note
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
        } else { // handle another client deleting trip
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
    let socket = io.connect('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected to socket');
    });
    this.setState({socket: socket}, () => {
      this.state.socket.on('update', () => {
        console.log('Received an update signal');
        this.getTrips('same trip, same note');
      });
      this.getTrips('latest trip, first note');
    });
    // socket.on('update', () => {
    //   console.log('Received an update signal');
    //   this.getTrips('same trip, same note');
    // });
    // this.getTrips('latest trip, first note');
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.mainHeader}>
          <div className={styles.appTitle}>jot</div>
          <div className={styles.appDescription}>Travel notes</div>
        </div>
        <div className={styles.mainBody}>
          <Trips trips={this.state.trips} addTrip={this.addTrip} deleteTrip={this.deleteTrip} selectTrip={this.selectTrip} selectedTrip={this.state.selectedTrip} />
          <div className={styles.rightSide}>
            {this.state.selectedTrip !== undefined && <Notes notes={this.state.selectedTrip.notes} addNote={this.addNote} deleteNote={this.deleteNote} selectNote={this.selectNote} selectedNote={this.state.selectedNote} />}
            {this.state.selectedTrip !== undefined && this.state.selectedNote !== undefined && <Note note={this.state.selectedNote} updateNote={this.updateNote} />}
          </div>
        </div>
      </div>
    );
  }
}
