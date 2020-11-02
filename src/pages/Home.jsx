import React, { Component } from "react";

import Page from "../components/Page";
import View from "../components/View";

import "./styles/Home.css";

class Home extends Component {
  render() {
    return (
      <Page>
        <View imageURL="https://lh3.googleusercontent.com/proxy/sji49lP9ZaGroT2xNlfRFiLPFJGOCRCnWX__ietTY_qx3tKg5nDVPha1zGXsUQKCbwGV7OqjwvUpabF0GB2Wt2fqPsVGhZW8bAgdmcBHBbRldFG2161YnbImdy4hpL4nLQ0GQ5qBuAL8Fg">
          View 1 Content goes here
        </View>
        <View imageURL="https://lh3.googleusercontent.com/proxy/mFBTp_6-NE4alMAqEqdDZXqEl7rVujw1WAm7qA30jVOSHjL-Gfu3TLiJakdHfOWamEczFOFIYajlDdVILn08fecCQRHgrLtnsL8jkzZn9ZxqityMb2Irx7E">
          View 2 Content goes here
        </View>
        <View imageURL="https://lh3.googleusercontent.com/proxy/laXbgYAfM_Tl-ydmEfm3ZTIZzhrdyag54mBMwUISc7jn9bhuuWdWkP_czR1QnFshUNHYLBS8mZ1LQxM1T_WYsVhU8kI8DFhp-45dB37yxmy9_KIS8xn1aDtSSkAO">
          View 3 Content goes here
        </View>
        <View imageURL="https://lh3.googleusercontent.com/proxy/GquGqQbFAGl8EScd9DwhnIqBRVF2dMRlqwU9f4P318ncqxGQsKtGvUHlwEjAg4XP5oP58kHX654rtYd3b3fzPNx4h3d5FQkOm9UHPo7TbXnYcjvU1LrSug">
          View 4 Content goes here
        </View>
      </Page>
    );
  }
}

export default Home;
