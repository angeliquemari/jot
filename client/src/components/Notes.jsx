import React from 'react';

export default function Notes({notes, addNote, selectNote}) {
  return (
    <div>
      <h4>Notes</h4>
      <button onClick={addNote}>Add note</button>
      {notes.map(note => <div key={note._id} noteid={note._id} onClick={selectNote}>{note.title}</div>)}
    </div>
  );
};
