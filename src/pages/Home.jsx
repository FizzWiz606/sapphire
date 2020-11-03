import React, { Component } from "react";

import Page from "../components/Page";
import View from "../components/View";

import Scrollbar from "../components/Scrollbar";

import "./styles/Home.css";

class Home extends Component {
  render() {
    return (
      <Page>
        <Scrollbar />
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img1.jpg">
          <h1>View 1</h1>
          <p>
            This is my portfolio site. It is extremely pleasant to meet you!
          </p>
        </View>
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img2.jpg">
          <h1>View 2</h1>
          <p>
            This is my portfolio site. It is extremely pleasant to meet you!
          </p>
        </View>
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img3.jpg">
          <h1>View 3</h1>
          <p>
            This is my portfolio site. It is extremely pleasant to meet you!
          </p>
        </View>
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img4.jpg">
          <h1>View 4</h1>
          <p>
            This is my portfolio site. It is extremely pleasant to meet you!
          </p>
        </View>
      </Page>
    );
  }
}

export default Home;
