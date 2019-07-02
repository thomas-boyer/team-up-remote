import React from 'react';
import { findChunk } from './fileHelpers.js';

import axios from 'axios';

const UploadForm = ({ file, email, socket, updateFile }) =>
{
  const assignedChunk = findChunk(file, email);

  const startUpload = (e) =>
  {
    e.preventDefault();

    //Attach uploaded file and user's email to form
    const formData = new FormData();
    formData.append(
      `${file.id}`,
      e.target[0].files[0]
    );

    formData.append('email', email);

    //Whenever upload progress is made,
    //send the amount uploaded to server via socket
    const postConfig =
    {
      onUploadProgress: (progressEvent) =>
      {
        socket.send(JSON.stringify(
          {
            id: file.id,
            email,
            uploaded: progressEvent.loaded
          }
        ));
      }
    };

    //Upload chunk
    axios.post(`http://localhost:8081/${file.id}`, formData, postConfig)
      .then( (response) =>
      {
        //If the chunk finishes successfully, update state accordingly
        if (response.data.chunkDone)
        {
          file.chunks[file.chunks.indexOf(assignedChunk)].done = true;
          //If the file is finished, update state accordingly
          if (response.data.fileDone)
          {
            file.done = true;
          }

          updateFile({ file });
        }
      })
  }

  //Only display upload form if user has not started upload yet
  if (assignedChunk.amount_uploaded === 0)
  {
    return (
      <form classname="choose-form" onSubmit={ startUpload } encType="multipart/form-data">
        <input className="choose-file" name="chunk" type="file"/>
        <input className="submit-file" type="submit"/>
      </form>
    )
  }
  else return null;
}

export default UploadForm;