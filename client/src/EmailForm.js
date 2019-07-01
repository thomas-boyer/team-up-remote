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
    <div>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Team Up</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Upload</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Download</a>
            </li>
          </ul>
        </div>
      </nav>
      </div>

      <div className="email-form">
        <h1>Please enter your email to view this file.</h1>
        <form onSubmit={ validateEmail }>
          <input type="email" name="email" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  )
}

export default EmailForm;