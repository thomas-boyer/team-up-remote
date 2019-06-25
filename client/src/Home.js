import React from 'react';
import './Home.css';

//TODO: Replace path below with the real path!
const Home = () =>
{
  return (

<div>
    <div>
    	<nav className="jumbotron">
    	<div className="theNav">
	      <h1 className="display-4">Team Up!</h1>
	      <p className="lead">
	      	Get files <i>faster</i>
	      </p>
	      	<div><hr className="my-4"></hr></div>
	      <p>A blahablah app that does neat thing take your files and go places feel good wow hooray</p>
          <img src="code-background.jpg" className="img-fluid" alt="Responsive image" />
        <a type="button" className="btn p-2 bd-highlight btn-primary btn-lg " href="" download="teamup.exe" >		
        	Download
        </a>
      </div>
    	</nav>  	
    </div>

     <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="code-background.jpg" className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="code-background.jpg" className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="code-background.jpg" className="d-block w-100" alt="..." />
          </div>
        </div>
        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
</div>
    
    
  )
}

export default Home;