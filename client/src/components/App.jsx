import React from 'react';
import styles from './styles/app.css';
import $ from 'jquery';
import Trips from './Trips';
import Notes from './Notes';
import Note from './Note';

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
    $.ajax({
      type: 'POST',
      url: '/trips',
      contentType: 'application/json',
      data: JSON.stringify({tripName: tripName}),
      success: () => {
        this.getTrips();
      }
    });
  }

  addNote(e) {
    e.preventDefault();
    let title = prompt('Please enter a title for your note:');
    $.ajax({
      type: 'POST',
      url: `/notes?trip=${this.state.selectedTrip._id}`,
      contentType: 'application/json',
      data: JSON.stringify({title: title, contents: ''}),
      success: () => {
        this.getTrips('last');
      }
    });
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
        this.getTrips('latest');
      }
    });
  }

  getTrips(noteFilter = 'first') {
    $.get('/trips', (trips) => {
      let selectedNote;
      if (noteFilter === 'first') {
        selectedNote = (trips.length && trips[0].notes.length) ? trips[0].notes[0] : undefined;
      }
      if (noteFilter === 'last') {
        selectedNote = trips[0].notes[trips[0].notes.length - 1];
      }
      if (noteFilter === 'latest') {
        selectedNote = trips[0].notes.filter(note => note._id === this.state.selectedNote._id)[0];
      }
      this.setState({
        trips: trips,
        selectedTrip: (trips.length) ? trips[0] : undefined,
        selectedNote: selectedNote
      });
    });
  }

  componentDidMount() {
    this.getTrips();
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <Trips trips={this.state.trips} addTrip={this.addTrip} selectTrip={this.selectTrip} />
        {this.state.selectedTrip !== undefined && <Notes notes={this.state.selectedTrip.notes} addNote={this.addNote} selectNote={this.selectNote} />}
        {this.state.selectedTrip !== undefined && this.state.selectedNote !== undefined && <Note note={this.state.selectedNote} updateNote={this.updateNote} />}
      </div>
    );
  }
}
