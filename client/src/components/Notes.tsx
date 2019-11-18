import React from 'react';
import {Note} from './App';

export function Notes(notes: Note['note'][]) {
  return (
    <div>Notes
      {notes.map(note => {
        return (
          <div key={note._id} >{note.title}</div>
        );
      })}
    </div>
  );
}

export default Notes;
