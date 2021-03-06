import React from 'react';
import styles from './styles/notes.css';

export default function Notes({notes, addNote, deleteNote, selectNote, selectedNote}) {
  return (
    <div className={styles.notesContainer}>
      <div className={styles.titleSection}>
        <h3>Notes</h3>
        <button onClick={deleteNote}>-</button>
        <button onClick={addNote}>+</button>
      </div>
      {notes.map(note => {
        return (
          <div className={styles.noteContainer} key={note._id} >
            <button noteid={note._id} onClick={selectNote} disabled={note._id === selectedNote._id}>
              {note.title}
            </button>
          </div>
        );
      })}
    </div>
  );
};
