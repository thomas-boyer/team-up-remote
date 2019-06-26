import React, { Component } from 'react';
import axios from 'axios';
import FileDownload from 'js-file-download';

class FileInfo extends Component
{
  constructor(route)
  {
    super();
    this.state =
    {
      email: '',
      file: {},
      fileLoaded: false,
      fileID: route.location.pathname,
      fileNotFound: false,
      done: false
    };

    this.server = 'http://localhost:8081';
    this.socket = new WebSocket('ws://localhost:8081');
  }

  validateEmail = (e) =>
  {
    e.preventDefault();

    const assignedChunk = this.state.file.chunks.find( (chunk) =>
      {
        return chunk.email === e.target[0].value;
      });

    if (assignedChunk)
    {
      this.setState({ email: assignedChunk.email, name: assignedChunk.name });
      this.socket.send(JSON.stringify({ setFile: this.state.file.id }));
    }
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
    if (this.state.email)
    {
      const assignedChunk = this.state.file.chunks.find( (chunk) =>
        {
          return chunk.email === this.state.email;
        });
      const chunkIndex = this.state.file.chunks.indexOf(assignedChunk);

      const startUpload = (e) =>
      {
        e.preventDefault();

        const formData = new FormData();
        formData.append(
          `${this.state.file.id}`,
          e.target[0].files[0]
        );

        formData.append(
          'email',
          this.state.email
        );
        formData.email = this.state.email;

        const postConfig =
        {
          onUploadProgress: (progressEvent) =>
          {
            this.socket.send(JSON.stringify(
              {
                id: this.state.file.id,
                email: this.state.email,
                uploaded: progressEvent.loaded
              }
            ));
          }
        };

        axios.post(`${this.server}${this.state.fileID}`, formData, postConfig);
      }

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

  download = () =>
  {
    axios.get(`${this.server}${this.state.fileID}/download/${this.state.file.file_name}`,
      {
        responseType: 'arraybuffer'
      })
      .then((response) =>
        {
          FileDownload(response.data, `${this.state.file.file_name}`);
        });
  }

  componentDidMount()
  {
    axios.get(`${this.server}${this.state.fileID}`)
      .then((response) =>
        {
          this.setState({ file: response.data, fileLoaded: true })

          console.log(this.state.file.chunks);

          if (this.state.file.chunks.every( (chunk) => { return chunk.done }))
          {
            this.setState({ done: true });
          }
        })
      .catch((error) =>
        {
          if (error.response.status === 404) this.setState({ fileNotFound: true });
        });

    const ws = this.socket;

    //On receiving a message, parse it and add it to the state
    ws.onmessage = (event) =>
    {
      const messageObj = JSON.parse(event.data);

      //If the message specifies a new number of users, update the state appropriately
      if (messageObj.uploaded)
      {
        const chunkIndex = this.state.file.chunks.findIndex( (chunk) =>
          { return chunk.email === messageObj.email }
        );

        const file = this.state.file;
        file.chunks[chunkIndex].amount_uploaded = messageObj.uploaded;

        this.setState({ file });
      }
    };

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
                <div className="progress">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={this.calculateProgress(chunk)}></div>
                </div>
              </div>
            )
          }
        });
    }

    let upload = this.state.fileLoaded && this.upload();

    //TODO: ENTER CORRECT PATHS
    //{ this.state.fileNotFound && <h1>404: File Not Found</h1> }
    return (
      <div>


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

        { this.state.fileLoaded && !this.state.done && this.state.email && (
          <div>
            <div className="progress">
              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={ this.calculateProgress(this.state.file) }></div>
            </div>
            <h2>Upload not yet complete</h2>
            { chunks }
            { upload }
          </div>
        )}

        { this.state.email && this.state.done && <button onClick={ this.download }>Download File</button> }
      </div>
    )
  }
}

export default FileInfo;
