import React from 'react';

const ProgressBar = ({ data }) =>
{
  //Returns CSS style that controls the width of progress bars
  const calculateProgress = (data) =>
  {
    let uploaded;

    //Check if data has chunks that need to be checked (used for total file progress)
    if (data.chunks)
    {
      uploaded = 0;
      data.chunks.forEach( (chunk) =>
        {
          uploaded += chunk.amount_uploaded;
        });
    }
    //This condition is used for individual chunk progress
    else uploaded = data.amount_uploaded;

    //Return an object representing inline CSS style
    //Expressed as a percentage of the total data size (from 0 to roughly 100)
    return { width: `${(uploaded / data.size) * 100}%`}
  }

  return (
    <div className="progress">
      <div className="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar"
           style={ calculateProgress(data) }></div>
    </div>
  )
}

export default ProgressBar;

