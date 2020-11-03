import "./App.css";

import React from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";

import Navigation from "./components/Navigation";

import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/works" exact component={Works} />

        <Navigation />
      </Router>
    </React.Fragment>
  );
}

export default App;
