import React from 'react';

export default function Note({note}) {
  return (
    <div>
      <h5>Note</h5>
      <div>{note.contents}</div>
    </div>
  );
};
