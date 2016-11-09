var React = require('react');
var ReactDOM = require('react-dom');
var PubSub = require('pubsub-js');
var camomile = require('./init.js');

var Header = require('./Header.jsx');
var Annotation = require('./Annotation.jsx');
var Footer = require('./Footer.jsx');

var Application =  React.createClass({

    sub: {},

    nbSub: 0,

    getInitialState: function(){
      return {
        authenticated: false,
        ready: false
      };
    },

    componentDidMount: function(){
      var me = this;
      var authSub = function( msg, data ){
        me.setState({authenticated:data});
      };
      this.sub[this.nbSub] = PubSub.subscribe('isAuth',authSub);
      this.nbSub++;
      camomile.then(function(camomile){
        camomile.me(function(data){
          return data;
        })
        .then(function (data) {
            me.setState({authenticated:true});
            PubSub.publish('isAuth',true)
          }
        ).catch(function(e){
          if (e.statusCode==401) console.log("Not logged yet");
        });
        me.setState({ready:true});
      });
    },

    componentWillUnmount: function(){
      var i;
      for (i=this.nbSub-1; i>=0; i--){
        PubSub.unsubscribe(this.sub[i]);
      }
    },

  	render: function(){
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
});

ReactDOM.render(
  <Application/>,
  document.getElementById('wrap')
);