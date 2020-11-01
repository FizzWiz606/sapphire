import React, { Component } from "react";

import "./styles/View.css";

class View extends Component {
  render() {
    return <div className="view">{this.props.children}</div>;
  }
}

export default View;
