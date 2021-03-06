import React, { Component } from 'react';
import EmailForm from './EmailForm.js';
import FileInfo from './FileInfo.js';
import UploadForm from './UploadForm.js';
import FileDownload from './FileDownload.js';
import { findChunk } from './fileHelpers.js';

import axios from 'axios';

class File extends Component
{
  constructor(route)
  {
    super();
    this.state =
    {
      email: '',
      file: {},
      fileLoaded: false,
      //filePath begins with a slash: eg, "/qwerty"
      filePath: route.location.pathname,
      fileNotFound: false,
    };

  this.SOCKET = new WebSocket('ws://172.105.10.189');
  }

  updateState = (stateChange) =>
  {
    this.setState(stateChange);
  }

  componentDidMount()
  {
    //On website load, get file data from database
    axios.get(`http://172.105.10.189${this.state.filePath}/details`)
      .then((response) =>
        {
          this.setState({ file: response.data, fileLoaded: true });
        });

    //Updates all progress bars based on info from database sent via websocket
    this.SOCKET.onmessage = (event) =>
    {
      const messageObj = JSON.parse(event.data);

      const file = this.state.file;
      const userChunkIndex = this.state.file.chunks.indexOf(findChunk(file, messageObj.email));
      file.chunks[userChunkIndex].amount_uploaded = messageObj.uploaded;

      this.setState({ file });
    };
  }

  render()
  {
    if (this.state.fileLoaded)
    {
      if (!this.state.email)
      {
        return (
          <EmailForm file={ this.state.file }
                     setUserInfo={ this.updateState }
                     socket={ this.SOCKET }/>
        )
      }
      else
      {
        if (!this.state.file.done)
        {
          return (
            <div className="chunk-gradient">
              <FileInfo file={ this.state.file }
                        userEmail={ this.state.email }
                        socket={ this.socket }/>

              <UploadForm file={ this.state.file }
                          email={ this.state.email }
                          socket={ this.SOCKET }
                          updateFile={ this.updateState }/>
            </div>
          )
        }
        else
        {
          return ( <FileDownload file={ this.state.file } /> )
        }
      }
    }
    else return null;
  }
}

export default File;