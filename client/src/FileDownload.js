import React from 'react';

import axios from 'axios';
import fileDownload from 'js-file-download';

const FileDownload = ({ file }) =>
{
  const ref = React.createRef();

  const download = (file) =>
  {
    //Set Response Type header to arraybuffer (instead of blob default)
    //in order to avoid downloaded data being mutated
    axios.get(`http://172.105.10.189/${file.id}/download/${file.file_name}`,
      {
        responseType: 'arraybuffer'
      })
      .then( (response) =>
      {
        fileDownload(response.data, file.file_name);
      });

    const node = document.createElement("h3");
    const text = document.createTextNode("Your file is downloading. This may take several minutes...");
    node.appendChild(text);
    document.getElementById("download").appendChild(node);
  }

  return (
  <div>
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="">Team Up</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="">Home <span className="sr-only">(current)</span></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="">Upload</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="">Download</a>
          </li>
        </ul>
      </div>
    </nav>
    </div>

    <div className="done-file" id="download">
      <h1>File Finished</h1>
      <button className="download-file" onClick={ () => download(file) }>Download File</button>
    </div>
  </div>
    )
}

export default FileDownload;