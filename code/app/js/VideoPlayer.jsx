var React = require('react');
var PubSub = require('pubsub-js');

Number.prototype.toVideoDuration = function(){
  var hours, minutes, seconds, group;
  group = []

  hours = Math.floor(this /  3600);
  minutes = Math.floor(this % 3600 / 60);
  seconds = Math.floor(this % 3600 % 60);

  if (hours > 0) { group.push((hours > 9) ? hours : "0" + hours); }
  group.push((minutes > 9) ? minutes : "0" + minutes);
  group.push((seconds > 9) ? seconds : "0" + seconds);

  return group.join(":");
};

class VideoFullScreenToggleButton extends React.Component {

  constructor(){
    super();
    this.requestFullscreen = this.requestFullscreen.bind(this);
  }

  requestFullscreen(){
    this.props.onToggleFullscreen();
  }

  render(){
    return (
      <button className="toggle_fullscreen_button" onClick={this.requestFullscreen}>
        <i className="glyphicon glyphicon-fullscreen"></i>
      </button>
    );
  }
}

class VideoTimeIndicator extends React.Component {

  render(){
    var current = (this.props.currentTime).toVideoDuration();
    var duration = (this.props.duration).toVideoDuration();
    return (
      <div className="time">
        <span className="current">{current}</span>/<span className="total">{duration}</span>
      </div>
    );
  }
}

class VideoVolumeButton extends React.Component {

  constructor(){
    super();
    this.toggleVolume = this.toggleVolume.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
  }

  toggleVolume(){
    this.props.toggleVolume(!this.props.muted);
  }

  changeVolume(e){
    this.props.changeVolume(e.target.value);
  }

  render(){
    var volumeLevel = this.props.volumeLevel, level;
    if(!this.props.muted){
      if (volumeLevel <= 0){
        level = 'muted';
      }else if (volumeLevel > 0 && volumeLevel <= 0.5){
        level = 'low';
      }else{
        level = 'high';
      }
    }
    else level = 'muted';

    var sound_levels = {
      'muted': 'glyphicon glyphicon-volume-off',
      'low': 'glyphicon glyphicon-volume-down',
      'high': 'glyphicon glyphicon-volume-up'
    }

    return (
      <div className="volume">
        <button onClick={this.toggleVolume}>
          <i className={sound_levels[level]}></i>
        </button>
        <input className="volume_slider" type="range" min="0" max="100" onInput={this.changeVolume} />
      </div>
    );
  }
}

class VideoPlaybackToggleButton extends React.Component {

  render(){
    var icon = this.props.playing ? (<i className="glyphicon glyphicon-pause"></i>) : (<i className="glyphicon glyphicon-play"></i>);
    return (
      <button className="toggle_playback" onClick={this.props.handleTogglePlayback}>
        {icon}
      </button>
    );
  }
}

class VideoProgressBar extends React.Component {

  render(){
    var playedStyle = {width: this.props.percentPlayed + '%'}
    var bufferStyle = {width: this.props.percentBuffered + '%'}
    return (
      <div className="progress_bar progress_bar_ref" onClick={this.props.handleProgressClick}>
        <div className="playback_percent" style={playedStyle}><span></span></div>
        <div className="buffer_percent" style={bufferStyle}></div>
      </div>
    );
  }
}

class Video extends React.Component {

  constructor(){
    super();
    this.updateCurrentTime = this.updateCurrentTime.bind(this);
    this.updateDuration = this.updateDuration.bind(this);
    this.playbackChanged = this.playbackChanged.bind(this);
    this.updateBuffer = this.updateBuffer.bind(this);
  }

  updateCurrentTime(times){
    this.props.currentTimeChanged(times);
  }

  updateDuration(duration){
    this.props.durationChanged(duration);
  }

  playbackChanged(shouldPause){
    this.props.updatePlaybackStatus(shouldPause);
  }

  updateBuffer(buffered){
    this.props.bufferChanged(buffered);
  }

  componentDidMount(){
    var video = document.getElementById("video");

    var me = this;

    // Sent when playback completes
    video.addEventListener('ended', function(e){
      me.playbackChanged(e.target.ended);
    }, false);

    var bufferCheck = setInterval(function(){
    try{
        var percent = (video.buffered.end(0) / video.duration * 100)
    } catch(ex){
      percent = 0;
    }
      me.updateBuffer(percent);
      if (percent == 100) { clearInterval(bufferCheck); }
    }, 500);

    video.addEventListener('durationchange', function(e){
      me.updateDuration(e.target.duration);
    }, false);

    video.addEventListener('timeupdate', function(e){
      me.updateCurrentTime({
        currentTime: e.target.currentTime,
        duration: e.target.duration
      });
    }, false)
  }

  render(){
    return (
      <video id="video" src={this.props.url}></video>
    );
  }
}

module.exports = React.createClass({

  sub: {},

  nbSub: 0,

  getInitialState: function(){
    return {
      url: '',
      playing: false,
      percentPlayed: 0,
      percentBuffered: 0,
      duration: 0,
      currentTime: 0,
      muted: false,
      volumeLevel: 0.5,
      fullScreen: false
    };
  },

  componentDidMount: function(){
    var me = this;
    var urlSub = function( msg, data ){
      me.setState({url:data});
    };
    this.sub[this.nbSub] = PubSub.subscribe(me.props.layer+'.medium_url',urlSub);
    this.nbSub++;
    var seekTimeSub = function(msg, data){
      if(data.origin!=me.props.id) document.getElementById("video").currentTime = data.t;
    };
    this.sub[this.nbSub] = PubSub.subscribe(me.props.layer+'.seekTime',seekTimeSub);
    this.nbSub++;
  },

  componentWillUnmount: function(){
    var i;
    for (i=this.nbSub-1; i>=0; i--){
      PubSub.unsubscribe(this.sub[i]);
    }
  },

  videoEnded: function(){
    this.setState({
      percentPlayed: 100,
      playing: false
    });
  },

  togglePlayback: function(){
    var me= this;
    this.setState({
      playing: !this.state.playing
    }, function(){
      if (this.state.playing){
        document.getElementById("video").play();
        PubSub.publish(me.props.layer+'.togglePlay','play');
      }else{
        document.getElementById("video").pause();
        PubSub.publish(me.props.layer+'.togglePlay','pause');
      }
    });
  },

  updateDuration: function(duration){
    this.setState({duration: duration});
  },

  updateBufferBar: function(buffered){
    this.setState({percentBuffered: buffered});
  },

  updateProgressBar: function(times){
    var percentPlayed = Math.floor((100 / times.duration) * times.currentTime);
    this.setState({
      currentTime: times.currentTime,
      percentPlayed: percentPlayed,
      duration: times.duration
    });
  },

  toggleMute: function(){
    this.setState({
      muted: !this.state.muted
    }, function(){
      document.getElementById("video").muted = this.state.muted;
    });
  },

  toggleFullscreen: function(){
    this.setState({
      fullScreen: !this.state.fullScreen
    }, function(){
      if (this.state.fullScreen){
        var docElm = document.documentElement;
        if(docElm.requestFullscreen){
          document.getElementById("video_player").requestFullscreen();
        }     
        if(docElm.webkitRequestFullScreen){
          document.getElementById("video_player").webkitRequestFullScreen();
        }
        if(docElm.mozRequestFullScreen){
          document.getElementById("video_player").mozRequestFullScreen();
        }
        if(docElm.msRequestFullscreen){
          document.getElementById("video_player").msRequestFullscreen();
        }
      }else{
        if(document.exitFullscreen){
          document.exitFullscreen();
        }
        if(document.mozCancelFullScreen){
          document.mozCancelFullScreen();
        }
        if(document.webkitCancelFullScreen){
          document.webkitCancelFullScreen();
        }
        if(document.msExitFullscreen){
          document.msExitFullscreen();
        }
      }
    });
  },

  handleVolumeChange: function(value){
    this.setState({volumeLevel: value / 100}, function(){
      document.getElementById("video").volume = this.state.volumeLevel;
    });
  },

  seekVideo: function(evt){
    var progress_barElm = evt.target;
    if(progress_barElm.className != 'progress_bar_ref'){
      progress_barElm = evt.target.parentElement;
    };
    var progBarDims = progress_barElm.getBoundingClientRect();
    var clickPos = evt.clientX - progBarDims.left + 5;  // 5 correction factor
    document.getElementById("video").currentTime = clickPos*this.state.duration/progBarDims.width;
    PubSub.publish(this.props.layer+'.seekTime',{origin:this.props.id,t:document.getElementById("video").currentTime});
  },

  render: function(){
    return (
      <div>
      { (this.state.url!='') ? (
        <div>
          <div className="video_player" id="video_player">
            <Video ref="video"
               url={"https://flower.limsi.fr/"+this.state.url+".mp4"}
               volume={this.state.volumeLevel}
               currentTimeChanged={this.updateProgressBar}
               durationChanged={this.updateDuration}
               updatePlaybackStatus={this.videoEnded}
               bufferChanged={this.updateBufferBar} />
            <div className="video_controls" ref="videoControls">
              <VideoProgressBar handleProgressClick={this.seekVideo} percentPlayed={this.state.percentPlayed} percentBuffered={this.state.percentBuffered} />
              <VideoPlaybackToggleButton handleTogglePlayback={this.togglePlayback} playing={this.state.playing} />
              <VideoVolumeButton muted={this.state.muted} volumeLevel={this.state.volumeLevel} toggleVolume={this.toggleMute} changeVolume={this.handleVolumeChange} />
              <VideoTimeIndicator duration={this.state.duration} currentTime={this.state.currentTime} />
              <div className="rhs">
                <VideoFullScreenToggleButton onToggleFullscreen={this.toggleFullscreen} />
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
});