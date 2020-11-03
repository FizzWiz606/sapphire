import React, { Component } from "react";
import "./styles/Scrollbar.css";

class Scrollbar extends Component {
  render() {
    return (
      <div className="scrollbar">
        <div className="scrollhead"></div>
      </div>
    );
  }
}

export default Scrollbar;
