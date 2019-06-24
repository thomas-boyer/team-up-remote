import React from 'react';
import './Home.css';

const Home = () =>
{
  return (
    <div className="jumbotron">
      <h1 className="display-4"
      >Team Up!</h1>
      <div>
        <a type="button" className="btn btn-primary btn-lg active" href="" download="teamup.exe">
        Download
      	</a>
      </div>
    </div>
  )
}

export default Home;