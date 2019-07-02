import React from 'react';
import Chunk from './Chunk.js';
import ProgressBar from './ProgressBar.js';

const FileInfo = ({ file, userEmail, socket }) =>
{
  const getChunks = (file) =>
  {
    return file.chunks.map( (chunk) =>
      {
        return ( <Chunk key={ file.chunks.indexOf(chunk) }
                        chunk={ chunk }/> )
      });
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

      <div className="file-info">
        <h1>{ file.file_name }</h1>

        <div>
          <ProgressBar data={ file }/>
          <h2>Upload completing</h2>
          { getChunks(file) }
        </div>
      </div>
    </div>
  )
}

export default FileInfo;