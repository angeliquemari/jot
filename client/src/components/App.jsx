import React from 'react';
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
    this.addTrip = this.addTrip.bind(this);
    this.addNote = this.addNote.bind(this);
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
  
  addTrip(e) {
    e.preventDefault();
    let tripName = prompt('Please enter a name for your trip:');
    $.ajax({
      type: 'POST',
      url: '/trips',
      contentType: 'application/json',
      data: JSON.stringify({tripName: tripName}),
      success: () => {
        this.getTrips()
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
        this.getTrips()
      }
    });
  }

  getTrips() {
    $.get('/trips', (trips) => {
      this.setState({
        trips: trips,
        selectedTrip: (trips.length) ? trips[0] : undefined,
        selectedNote: (trips.length && trips[0].notes.length) ? trips[0].notes[0] : undefined
      });
    });
  }

  componentDidMount() {
    this.getTrips();
  }

  render() {
    return (
      <div>
        <Trips trips={this.state.trips} addTrip={this.addTrip} selectTrip={this.selectTrip} />
        {this.state.selectedTrip !== undefined && <Notes notes={this.state.selectedTrip.notes} addNote={this.addNote} />}
        {this.state.selectedTrip !== undefined && this.state.selectedNote !== undefined && <Note note={this.state.selectedNote} />}
      </div>
    );
  }
}
