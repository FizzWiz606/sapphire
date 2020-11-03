import React, { Component } from "react";

import Page from "../components/Page";
import View from "../components/View";

import "./styles/Home.css";

class Home extends Component {
  render() {
    return (
      <Page>
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img1.jpg">
          View 1 Content goes here
        </View>
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img2.jpg">
          View 2 Content goes here
        </View>
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img3.jpg">
          View 3 Content goes here
        </View>
        <View imageURL="http://192.168.43.247:5500/src/assets/images/img4.jpg">
          View 4 Content goes here
        </View>
      </Page>
    );
  }
}

export default Home;
