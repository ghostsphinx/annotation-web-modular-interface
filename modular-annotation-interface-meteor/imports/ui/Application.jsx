import React from 'react';
import Camomile from 'camomile-client';
import {res} from '../../client/init.js';

import Header from './Header.jsx';
import Annotation from './Annotation.jsx';
import Footer from './Footer.jsx';

export default class Application extends React.Component{

    constructor(){
      super();
      this.state = {
        authenticated: false,
        ready: false
      };
    }

    componentDidMount(){
      var me = this;
      res.then(function(camService){
        camService.me()
        .then(function (err, data) {
          if (data != undefined) {

          } else {
            me.setState({authenticated:true})
          }
          me.setState({ready:true});
        });
      });
    }

    componentWillUnmount(){
      var i;
      for (i=this.nbSub-1; i>=0; i--){
        PubSub.unsubscribe(this.sub[i]);
      }
    }

  	render(){
  		return(
        <div>
          { this.state.ready ? (
            <div>
  		        <Header auth={this.state.authenticated}></Header>
              { this.state.authenticated ? (
                <Annotation></Annotation>
              ) : (
                <div></div>
              )}
              <Footer></Footer>
            </div>
          ) : (
            <div>Waiting for server</div>
          )}
        </div>
  		);
  	}
}