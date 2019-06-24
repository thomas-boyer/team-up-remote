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

  calculateProgress = (data) =>
  {
    let uploaded;
    if (data.chunks)
    {
      uploaded = 0;
      data.chunks.forEach( (chunk) =>
        {
          uploaded += chunk.amount_uploaded;
        });
    }
    else uploaded = data.amount_uploaded;

    return { width: `${(uploaded / data.size) * 100}%`}
  }

  upload = () =>
  {
    const startUpload = (e) =>
    {
      e.preventDefault();

      const formData = new FormData();
      formData.append(
        `${this.state.file.id}`,
        e.target[0].files[0]
      );

      axios.post(`${this.server}${this.state.fileID}`, formData)
        .then((response) =>
          {
            console.log(response);
          })
        .catch((error) =>
          {
            //if (error.response.status === 404) this.setState({ fileNotFound: true });
          });
    }

    if (this.state.email)
    {
      const assignedChunk = this.state.file.chunks.find( (chunk) =>
        {
          return chunk.email === this.state.email;
        });

      if (assignedChunk.amount_uploaded === 0)
      {
        return (
          <form onSubmit={ startUpload } encType="multipart/form-data">
            <input name="chunk" type="file" />
            <input type="submit" />
          </form>
        )
      }
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

    let upload = this.state.fileLoaded && this.upload();

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
            <div className="progress-bar">
              <div className="progress" style={ this.calculateProgress(this.state.file) }></div>
            </div>
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
