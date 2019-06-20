import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

  constructor()
  {
    super();
    this.state =
    {
      data: null
    }
    this.server = "http://localhost:8080"
  }


  // makeTestCall = async (e) =>
  // {
  //   e.preventDefault();
  //   const value = e.target[0].value;
  //   const response = await axios.post(`${this.server}/test`, { value });
  //   this.setState({ data: response.data.express })
  // }

  //TODO: Insert application path in href tag below!
  render() {
    return (
      <div className="App">
        <h1>Team Up!</h1>
        <div>
          <a href="" download="teamup.exe">Download</a>
        </div>
      </div>
    );
  }
}

export default App;
