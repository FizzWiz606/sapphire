import "./App.css";

import React from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/works" exact component={Works} />

        <nav>
          <h1>
            <Link to="/">Home</Link>
          </h1>
          <h1>
            <Link to="/about">About</Link>
          </h1>
          <h1>
            <Link to="/works">Works</Link>
          </h1>
        </nav>
      </Router>
    </React.Fragment>
  );
}

export default App;
