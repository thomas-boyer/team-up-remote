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
    <div className="file-info">
      <h1>{ file.file_name }</h1>

      <div>
        <ProgressBar data={ file }/>
        <h2>Upload completing</h2>
        { getChunks(file) }
      </div>
    </div>
  )
}

export default FileInfo;