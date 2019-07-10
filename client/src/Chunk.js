import React from 'react';
import ProgressBar from './ProgressBar.js';

const Chunk = ({ chunk, calculateProgress }) =>
{
  return (
    <div className="chunk">
      <h3>{ chunk.name }</h3>
      <h4>{ chunk.email }</h4>
      {
        chunk.amount_uploaded === 0 &&
        ( <h4>File upload not started</h4> )
      }
      {
        chunk.amount_uploaded > 0 &&
        <ProgressBar data={ chunk }/>
      }
      {
        chunk.done &&
        <h4>Done!</h4>
      }
    </div>
  )
}

export default Chunk;