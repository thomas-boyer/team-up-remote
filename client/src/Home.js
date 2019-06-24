import React from 'react';
import './Home.css';

const Home = () =>
{
  return (
    <div>
    	<nav className="jumbotron">
    	<div className="theNav">
	      <h1 className="display-4">Team Up!</h1>
		      <p className="lead">
		      	Get files <i>faster</i>
		      </p>
		      <div><hr className="my-4"></hr></div>
	        <a type="button" className="btn btn-primary btn-lg" href="" download="teamup.exe">		
	        	Download
	        </a>
      </div>
    	</nav>
    </div>
  )
}

export default Home;