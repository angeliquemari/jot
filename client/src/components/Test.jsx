import React from 'react';
import io from 'socket.io-client';

export default function Test() {
  let socket;
  let focusIn = () => {
    console.log('Opening socket connection');
    socket = io.connect('http://localhost:3000');
  };
  let focusOut = () => {
    console.log('Closing socket connection');
    socket.disconnect();
  };
  return (
    <div>
      <textarea onFocus={focusIn} onBlur={focusOut}></textarea>
    </div>
  );
};
