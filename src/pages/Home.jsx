import React, { Component } from "react";

import Page from "../components/Page";
import View from "../components/View";

import "./styles/Home.css";

class Home extends Component {
  render() {
    return (
      <Page>
        <View imageURL="https://images.pexels.com/photos/2128042/pexels-photo-2128042.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500">
          View 1 Content goes here
        </View>
        <View imageURL="https://images.pexels.com/photos/2603464/pexels-photo-2603464.jpeg?cs=srgb&dl=pexels-aleksandar-pasaric-2603464.jpg&fm=jpg">
          View 2 Content goes here
        </View>
      </Page>
    );
  }
}

export default Home;
