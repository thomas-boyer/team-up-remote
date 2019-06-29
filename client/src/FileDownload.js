import React from 'react';

import axios from 'axios';
import fileDownload from 'js-file-download';

const FileDownload = ({ file }) =>
{
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
  }

  return (
    <div>
      <h1>File Finished</h1>
      <button onClick={ () => download(file) }>Download File</button>
    </div>
    )
}

export default FileDownload;