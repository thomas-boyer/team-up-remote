import React, { Component } from 'react';
import axios from 'axios';

class FileInfo extends Component
{
  constructor(route)
  {
    super();
    this.state =
    {
      fileID: route.location.pathname,
      fileName: null,
      fileNotFound: false
    };
    this.server = "http://localhost:8080"
  }

  componentDidMount()
  {
    axios.get(`${this.server}${this.state.fileID}`)
      .then((response) =>
        {
          console.log(response.data);
          this.setState({ fileName: response.data.file.file_name });
        })
      .catch((error) =>
        {
          if (error.response.status === 404) this.setState({ fileNotFound: true });
        });
  }

  render()
  {
    return (
      <div>
        { this.state.fileNotFound && <h1>404: File Not Found</h1> }
        <h1>{ this.state.fileName }</h1>
      </div>
    )
  }
}

export default FileInfo;
