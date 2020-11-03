import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./styles/Navigation.css";

class Navigation extends Component {
  render() {
    return (
      <nav>
        <h4>
          <Link to="/">Home</Link>
        </h4>
        <h4>
          <Link to="/about">About</Link>
        </h4>
        <h4>
          <Link to="/works">Works</Link>
        </h4>
      </nav>
    );
  }
}

export default Navigation;
