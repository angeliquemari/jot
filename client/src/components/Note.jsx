import React from 'react';

export default function Note({note, updateNote}) {
  return (
    <div>
      <textarea value={note.contents} onChange={updateNote}></textarea>
    </div>
  );
};
