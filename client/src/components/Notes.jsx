import React from 'react';

export default function Trips({notes}) {
  return (
    <div>
      <h3>Notes</h3>
      {notes.map(note => <div key={note._id}>{note.title}</div>)}
    </div>
  );
};
