import React from 'react';
import { findChunk } from './fileHelpers.js';

const EmailForm = ({ file, setUserInfo, socket }) =>
{
  //When user inputs email, checks that email matches an
  //email associated with one of the file's chunks
  const validateEmail = (e) =>
  {
    e.preventDefault();

    const assignedChunk = findChunk(file, e.target[0].value);

    if (assignedChunk)
    {
      setUserInfo({ email: assignedChunk.email, name: assignedChunk.name });

      //Tell the server to associate this file with the socket used by the current user
      socket.send(JSON.stringify({ setFile: file.id }));
    }
  }

  return (
      <div className="email-form">
        <h1>Please enter your email to view this file.</h1>
        <form onSubmit={ validateEmail }>
          <input type="email" name="email" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
}

export default EmailForm;