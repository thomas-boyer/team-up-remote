import React, { Component } from 'react';
import axios from 'axios';

class FileInfo extends Component
{
  constructor(route)
  {
    super();
    this.state =
    {
      file: {},
      fileLoaded: false,
      fileID: route.location.pathname,
      fileNotFound: false,
    };

    this.server = "http://localhost:8080";
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
          return (
            <div key={ chunk.email } >
              <h3>{ chunk.name }</h3>
              <h4>{ chunk.email }</h4>
            </div>
          )
        })
    }

    //TODO: ENTER CORRECT PATHS
    return (
      <div>
      { this.state.fileNotFound && <h1>404: File Not Found</h1> }

      { this.state.fileLoaded && <h1>{ this.state.file.file_name }</h1> }

      { this.state.file.done && <a href="../welt.jpg" download={ this.state.file.file_name }>Download</a> }

      { this.state.fileLoaded && !this.state.file.done && chunks }
      </div>
    )
  }
}

export default FileInfo;
