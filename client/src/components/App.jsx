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
      selectedTrip: undefined, // {notes: []},
      selectedNote: undefined //{title: '', contents: ''}
    };
  }

  componentDidMount() {
    $.get('/trips', (trips) => {
      this.setState({
        trips: trips,
        selectedTrip: (trips.length) ? trips[0] : undefined,
        selectedNote: (trips.length && trips[0].notes.length) ? trips[0].notes[0] : undefined
      });
    });
  }

  render() {
    return (
      <div>
        <Trips trips={this.state.trips} />
        {this.state.selectedTrip !== undefined && <Notes notes={this.state.selectedTrip.notes} />}
        {this.state.selectedTrip !== undefined && this.state.selectedNote !== undefined && <Note note={this.state.selectedNote} />}
      </div>
    );
  }
}
