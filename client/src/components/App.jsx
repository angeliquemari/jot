import React from 'react';
import styles from './styles/app.css';
import io from 'socket.io-client';
import helpers from './helpers.js';
import Trips from './Trips';
import Notes from './Notes';
import Note from './Note';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      selectedTrip: undefined,
      selectedNote: undefined,
      cursorPosition: undefined,
      socket: undefined
    };
    this.noteTextArea = React.createRef();
    this.addTrip = helpers.addTrip.bind(this);
    this.selectTrip = helpers.selectTrip.bind(this);
    this.selectNote = helpers.selectNote.bind(this);
    this.deleteTrip = helpers.deleteTrip.bind(this);
    this.addNote = helpers.addNote.bind(this);
    this.updateNote = helpers.updateNote.bind(this);
    this.setCursorPosition = helpers.setCursorPosition.bind(this);
    this.deleteNote = helpers.deleteNote.bind(this);
    this.getTrips = helpers.getTrips.bind(this);
  }

  componentDidMount() {
    // set up websocket and set state
    let socket = io.connect('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected to socket');
    });
    this.setState({socket: socket}, () => {
      // set up listening for updates
      this.state.socket.on('update', () => {
        this.getTrips('same trip, same note');
      });
      // fetch initial data from server and set state
      this.getTrips('latest trip, first note');
    });
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
            {this.state.selectedTrip !== undefined && this.state.selectedNote !== undefined && <Note noteRef={this.noteTextArea} note={this.state.selectedNote} updateNote={this.updateNote} cursorPosition={this.state.cursorPosition} setCursorPosition={this.setCursorPosition} />}
          </div>
        </div>
      </div>
    );
  }
}
