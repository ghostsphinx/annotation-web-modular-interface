var React = require('react');
var PubSub = require('pubsub-js');
var Peaks = require('../../node_modules/peaks.js/peaks.js');

module.exports = React.createClass({

  p: null,

  sub: {},

  nbSub: 0,

  getInitialState: function(){
    return {
      url:''
    };
  },

  componentDidMount: function(){
    var me = this;
    var urlSub = function( msg, data ){
      me.setState({url:data});
      if(me.p != undefined) me.p.destroy();
      me.p = Peaks.init({
        container: document.getElementById('waveform'),
        mediaElement: document.getElementById("audio")
      });
      document.getElementById("waveform").onclick = function(){
        PubSub.publish(me.props.layer+'.seekTime',{origin:me.props.id,t:me.p.time.getCurrentTime()});
      };
    };
    this.sub[this.nbSub] = PubSub.subscribe(me.props.layer+'.medium_url',urlSub);
    this.nbSub++;
    var togglePlaySub = function(msg, data){
      if(data=="pause"){
        document.getElementById('audio').pause();
      }
      else if(data=="play"){
        document.getElementById('audio').play();
      }
    };
    this.sub[this.nbSub] = PubSub.subscribe(me.props.layer+'.togglePlay',togglePlaySub);
    this.nbSub++;
    var seekTimeSub = function(msg, data){
      if(data.origin!=me.props.id) me.p.time.setCurrentTime(data.t);
    };
    this.sub[this.nbSub] = PubSub.subscribe(me.props.layer+'.seekTime',seekTimeSub);
    this.nbSub++;
  },

  componentWillUpdate: function(){
    if(this.p != undefined){
      this.p.destroy();
    }
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
        { (this.state.url!='') ? (
          <div>
            <div className="waveform" id="waveform"></div>
            <audio id="audio" src={"https://flower.limsi.fr/"+this.state.url+".mp4"} muted/>
          </div>
        ) : (
          <div id="waveform" hidden></div>
        )}
      </div>
    );
  }
});