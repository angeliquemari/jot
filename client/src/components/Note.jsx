import React from 'react';
import styles from './styles/note.css';

export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.setCursorPosition = this.props.setCursorPosition;
  }

  componentDidMount() {
    this.setCursorPosition();
  }

  componentDidUpdate() {
    this.setCursorPosition();
  }

  render() {
    return (
      <div className={styles.noteContainer}>
        <textarea ref={this.props.noteRef} value={this.props.note.contents} onChange={this.props.updateNote}></textarea>
      </div>
    );
  }
}
