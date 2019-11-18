import React from 'react';
import styles from './styles/note.css';

export default function Note({note, updateNote}) {
  return (
    <div className={styles.noteContainer}>
      <textarea value={note.contents} onChange={updateNote}></textarea>
    </div>
  );
};
