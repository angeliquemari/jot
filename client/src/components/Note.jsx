import React from 'react';

export default function Note({note}) {
  return (
    <div>
      <h3>Note</h3>
      <div>{note.contents}</div>
    </div>
  );
};
