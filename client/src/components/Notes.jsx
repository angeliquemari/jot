import React from 'react';
import styles from './styles/notes.css';

export default function Notes({notes, addNote, selectNote, selectedNote}) {
  return (
    <div className={styles.notesContainer}>
      <div className={styles.titleSection}>
        <h3>Notes</h3>
        <button className={styles.addNoteButton} onClick={addNote}>Add</button>
      </div>
      {notes.map(note => {
        return (
          <div className={styles.noteContainer} key={note._id} >
            <button className={styles.note} noteid={note._id} onClick={selectNote} disabled={note._id === selectedNote._id}>
              {note.title}
            </button>
          </div>
        );
      })}
    </div>
  );
};
