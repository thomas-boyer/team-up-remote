import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './Home.js';
import FileInfo from './FileInfo.js';
import './App.css';

class App extends Component {

  constructor()
  {
    super();
    this.state =
    {
      data: null
    }
  }

  //TODO: Insert application path in href tag below!
  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/:id" component={FileInfo} />
      </Router>
    )
  }
}

export default App;
