import React from 'react';

export default function Note({note, updateNote}) {
  return (
    <div>
      <h5>Note</h5>
      <textarea value={note.contents} onChange={updateNote}></textarea>
    </div>
  );
};
