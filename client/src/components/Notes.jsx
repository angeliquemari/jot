import React from 'react';

export default function Notes({notes, addNote}) {
  return (
    <div>
      <h3>Notes</h3>
      <button onClick={addNote}>Add note</button>
      {notes.map(note => <div key={note._id}>{note.title}</div>)}
    </div>
  );
};
