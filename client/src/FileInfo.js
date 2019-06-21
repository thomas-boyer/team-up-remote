import React, { Component } from 'react';
import axios from 'axios';

class FileInfo extends Component
{
  constructor(route)
  {
    super();
    this.state =
    {
      email: "",
      file: {},
      fileLoaded: false,
      fileID: route.location.pathname,
      fileNotFound: false,
    };

    this.server = "http://localhost:8080";
  }

  validateEmail = (e) =>
  {
    e.preventDefault();

    const assignedChunk = this.state.file.chunks.find( (chunk) =>
      {
        return chunk.email === e.target[0].value;
      });

    if (assignedChunk) this.setState({ email: assignedChunk.email, name: assignedChunk.name });
  }

  calculateProgress = (chunk) =>
  {
    return { width: `${(chunk.amount_uploaded / chunk.size) * 100}%`}
  }

  startUpload = () =>
  {
    const assignedChunk = this.state.file.chunks.find( (chunk) =>
      {
        return chunk.email === this.state.email;
      });

    if (assignedChunk.amount_uploaded === 0)
    {
      return (
        <a href="test.html">Start Upload</a>
      )
    }
  }

  componentDidMount()
  {
    axios.get(`${this.server}${this.state.fileID}`)
      .then((response) =>
        {
          this.setState({ file: response.data, fileLoaded: true })
        })
      .catch((error) =>
        {
          if (error.response.status === 404) this.setState({ fileNotFound: true });
        });
  }

  render()
  {
    let chunks;

    if (this.state.fileLoaded)
    {
      chunks = this.state.file.chunks.map( (chunk) =>
        {
          if (chunk.amount_uploaded === 0)
          {
            return (
              <div key={ chunk.email } >
                <h3>{ chunk.name }</h3>
                <h4>{ chunk.email }</h4>
                <h4>File upload not started</h4>
              </div>
            )
          }
          else
          {
            return (
              <div key={ chunk.email } >
                <h3>{ chunk.name }</h3>
                <h4>{ chunk.email }</h4>
                <div className="progress-bar">
                  <div className="progress" style={this.calculateProgress(chunk)}></div>
                </div>
              </div>
            )
          }
        })
    }

    let upload = this.state.fileLoaded && this.startUpload();

    //TODO: ENTER CORRECT PATHS
    return (
      <div>
        { this.state.fileNotFound && <h1>404: File Not Found</h1> }

        { this.state.fileLoaded && !this.state.email && (
          <div>
            <h1>Please enter your email.</h1>
            <form onSubmit={ this.validateEmail }>
              <input type="email" name="email" />
              <input type="submit" />
            </form>
          </div>
        )}

        { this.state.fileLoaded && this.state.email && <h1>{ this.state.file.file_name }</h1> }

        { this.state.fileLoaded && !this.state.file.done && this.state.email && (
          <div>
            <h2>Upload not yet complete</h2>
            { chunks }
            { upload }
          </div>
        )}

        { this.state.file.done && <a href="THE_FILE.exe" download={ this.state.file.file_name }>Download</a> }
      </div>
    )
  }
}

export default FileInfo;
