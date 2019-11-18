import React from 'react';
import styles from './styles/notes.css';

export default function Notes({notes, addNote, selectNote}) {
  return (
    <div className={styles.notesContainer}>
      <div className={styles.titleSection}>
        <h3>Notes</h3>
        <button className={styles.addNoteButton} onClick={addNote}>Add</button>
      </div>
      {notes.map(note => {
        return (
          <div className={styles.noteContainer} key={note._id} >
            <div className={styles.note} noteid={note._id} onClick={selectNote}>{note.title}</div>
          </div>
        );
      })}
    </div>
  );
};
