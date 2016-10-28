//---------------------TITLE OF THE HEADER MODULE-------------------------------------------
class Title extends React.Component{
  render(){
    return(
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">MediaEval Frontend Dev</a>
        </div>
    );
  }
}

//---------------------------LOG MODULE------------------------------------------
class Log extends React.Component{

  constructor(){
    super();
    this.state = {
      authenticated: false,
      user: '',
      password: ''
    };
  }

  componentDidMount(){
    var me = this;
    globalVar.callback1 = (data) => {
      me.setState({authenticated:data.isAuth, user:data.name});
    };
  }

  handleChangeUser(e){
    this.setState({user: e.target.value});

  }

  handleChangePassword(e){
    this.setState({password: e.target.value});
  }

  login(){
    var me = this;
    Camomile.login(this.state.user,this.state.password,function(){
      Camomile.me(function (err, data) {
        if (data.error) {
          document.getElementById("alert_log_failed").innerHTML = "Wrong login ";
        } else {
          document.getElementById("alert_log_failed").innerHTML = "";
          me.setState({authenticated:true, password:''});
          session.name = me.state.user;
          session.isAuth = me.state.authenticated;
          PubSub.publish('isAuth',session.isAuth);
        }
      });
    });
  }

  loginPress(e){
    if(e.keyCode==13){
      this.login();
    }
  }

  logout(){
    var me = this;
    Camomile.logout(function(){
      me.setState({authenticated:false});
      session.name = "";
      session.isAuth = me.state.authenticated;
      PubSub.publish('isAuth',false);
      PubSub.publish('corpus_id','');
      PubSub.publish('medium_id','');
    });
  }

  render(){
    return(
      <div className="navbar-collapse collapse">
        { !this.state.authenticated ? (
          <div name="login-window" autoComplete="on" className="navbar-form navbar-right">
            <font id="alert_log_failed" color="red">
            </font>
            <div className="form-group">
              <input id="login" name="login" type="text" value={this.state.user} onChange={this.handleChangeUser.bind(this)} autoComplete="on" placeholder="Login" className="form-control" style={{width:160+'px'}}/>
            </div>
            <div className="form-group">
              <input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChangePassword.bind(this)} onKeyUp={this.loginPress.bind(this)} autoComplete="on" placeholder="Password" className="form-control" style={{width:160+'px'}}/>
            </div>
            <button type="button" className="btn btn-success" onClick={this.login.bind(this)} >Sign in</button>
          </div>
        ) : (
          <div>
            <form name="logout-form" autoComplete="on" className="navbar-form navbar-right">
              <font color="white">
                {this.state.user+' '}
              </font>
              <button type="button" className="btn btn-danger" onClick={this.logout.bind(this)}>
                <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

//----------------------------CORPUS SELECTION MODULE----------------------------------
class CorpusSelection extends React.Component {

  constructor(){
    super();
    this.handleChangeCorpus = this.handleChangeCorpus.bind(this);
  }

  componentDidMount(){
    var option = document.createElement("option");
    option.value = 1;
    option.innerHTML = "--Choose a corpus--";
    document.getElementById("corpus_selection").appendChild(option);
    Camomile.getCorpora(function(err, data){
      var i;
      for(i = 1; i < data.length; i++){
        var option = document.createElement("option");
        option.value = i+1;
        option.innerHTML = data[i].name;
        document.getElementById("corpus_selection").appendChild(option);
      }
    });
  }

  handleChangeCorpus(event){
    var val = event.target.value-1;
    if(val>0){
      Camomile.getCorpora(function(err, data){
        PubSub.publish('corpus_id', data[val]._id);
      });
    }
    else {
      PubSub.publish('corpus_id', '');
    }
  }

  render(){
    return(
      <form>
        <select id="corpus_selection" onChange={this.handleChangeCorpus}>
        </select>
      </form>
    );
  }
}

//----------------------------MEDIUM SELECTION MODULE----------------------------------
class MediumSelection extends React.Component {

  constructor(){
    super();
    this.state = {
      corpus_id:''
    };
    var sub;
    this.handleChangeMedium = this.handleChangeMedium.bind(this);
  }

  componentDidMount(){
    var option = document.createElement("option");
    option.value = 1;
    option.innerHTML = "--Choose a medium--";
    document.getElementById("medium_selection").appendChild(option);
    var me = this;
    var corpusSub = function( msg, data ){
      me.setState({corpus_id:data});
      if(me.state.corpus_id=='') PubSub.publish('medium_url', '');
    };
    this.sub = PubSub.subscribe('corpus_id',corpusSub);
  }

  componentWillUnmount(){
    PubSub.unsubscribe(this.sub);
  }

  componentDidUpdate(prevProps, prevState){
    var options = {filter:{corpus_id:''}};
    if(this.state.corpus_id!='' && prevState.corpus_id==''){
      options.filter.id_corpus = this.state.corpus_id;
      Camomile.getMedia(function(err, data){
        var i;
        for(i = 1; i < data.length; i++){
          var option = document.createElement("option");
          option.value = i+1;
          option.innerHTML = data[i].name;
          document.getElementById("medium_selection").appendChild(option);
        }
      },options);
    }
    else{
      var i;
      for(i = document.getElementById("medium_selection").options.length -1 ; i > 0; i--){
        document.getElementById("medium_selection").remove(i);
      }
      if(this.state.corpus_id!=''){
        options.filter.id_corpus = this.state.corpus_id;
        Camomile.getMedia(function(err, data){
          var i;
          for(i = 0; i < data.length; i++){
            var option = document.createElement("option");
            option.value = i+1;
            option.innerHTML = data[i].name;
            document.getElementById("medium_selection").appendChild(option);
          }
        },options);
      }
    }
  }

  handleChangeMedium(event){
    var val = event.target.value-1;
    var options = {filter:{corpus_id:''}};
    if(val>0){
      options.filter.id_corpus = this.state.corpus_id;
      Camomile.getMedia(function(err, data){
        PubSub.publish('medium_url', data[val].url);
      },options);
    }
    else PubSub.publish('medium_url', '');
  }

  render(){
    return(
      <form>
        <select id="medium_selection" onChange={this.handleChangeMedium}>
        </select>
      </form>
    );
  }
}

//-----------------------------VIDEO PLAYER MODULE----------------------------------------
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
}

var VideoFullScreenToggleButton = React.createClass({
  requestFullscreen: function(){
    this.props.onToggleFullscreen();
  },
  render: function(){
    return (
      <button className="toggle_fullscreen_button" onClick={this.requestFullscreen}>
        <i className="glyphicon glyphicon-fullscreen"></i>
      </button>
    );
  }
});

var VideoTimeIndicator = React.createClass({
  render: function(){
    var current = (this.props.currentTime).toVideoDuration();
    var duration = (this.props.duration).toVideoDuration();
    return (
      <div className="time">
        <span className="current">{current}</span>/<span className="total">{duration}</span>
      </div>
    );
  }
});

var VideoVolumeButton = React.createClass({
  toggleVolume: function(){
    this.props.toggleVolume(!this.props.muted);
  },
  changeVolume: function(e){
    this.props.changeVolume(e.target.value);
  },
  render: function(){
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
});

var VideoPlaybackToggleButton = React.createClass({
  render: function(){
    var icon = this.props.playing ? (<i className="glyphicon glyphicon-pause"></i>) : (<i className="glyphicon glyphicon-play"></i>);
    return (
      <button className="toggle_playback" onClick={this.props.handleTogglePlayback}>
        {icon}
      </button>
    );
  }
});

var VideoProgressBar = React.createClass({
  render: function(){
    var playedStyle = {width: this.props.percentPlayed + '%'}
    var bufferStyle = {width: this.props.percentBuffered + '%'}
    return (
      <div className="progress_bar progress_bar_ref" onClick={this.props.handleProgressClick}>
        <div className="playback_percent" style={playedStyle}><span></span></div>
        <div className="buffer_percent" style={bufferStyle}></div>
      </div>
    );
  }
});

var Video = React.createClass({
  updateCurrentTime: function(times){
    this.props.currentTimeChanged(times);
  },
  updateDuration: function(duration){
    this.props.durationChanged(duration);
  },
  playbackChanged: function(shouldPause){
    this.props.updatePlaybackStatus(shouldPause);
  },
  updateBuffer: function(buffered){
    this.props.bufferChanged(buffered);
  },
  componentDidMount: function(){
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
  },
  render: function(){
    return (
      <video id="video" src={this.props.url}></video>
    );
  }
});

var VideoPlayer = React.createClass({
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
      fullScreen: false,
      sub: ''
    };
  },
  componentDidMount: function(){
    var me = this;
    var urlSub = function( msg, data ){
      me.setState({url:data});
    };
    this.sub = PubSub.subscribe('medium_url',urlSub);
  },
  componentWillUnmount: function(){
    PubSub.unsubscribe(this.sub);
  },
  videoEnded: function(){
    this.setState({
      percentPlayed: 100,
      playing: false
    });
  },
  togglePlayback: function(){
    this.setState({
      playing: !this.state.playing
    }, function(){
      if (this.state.playing){
        document.getElementById("video").play();
        PubSub.publish('togglePlay','play');
      }else{
        document.getElementById("video").pause();
        PubSub.publish('togglePlay','pause');
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
    PubSub.publish('seekTime',{origin:"video",t:document.getElementById("video").currentTime});
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

//--------------------------WAVEFORM PLAYER MODULE---------------------------------------
class Waveform extends React.Component {

  constructor(){
    super();
    this.state = {
      url:''
    };
    var p;
    var sub;
    var nbSub;
  }

  componentDidMount(){
    this.sub = {};
    this.nbSub = 0;
    var me = this;
    var urlSub = function( msg, data ){
      me.setState({url:data});
      if(me.p != undefined) me.p.destroy();
      me.p = Peaks.init({
        container: document.getElementById('waveform'),
        mediaElement: document.getElementById("audio")
      });
    };
    this.sub[this.nbSub] = PubSub.subscribe('medium_url',urlSub);
    this.nbSub++;
    var togglePlaySub = function(msg, data){
      if(data=="pause"){
        document.getElementById('audio').pause();
      }
      else if(data=="play"){
        document.getElementById('audio').play();
      }
    };
    this.sub[this.nbSub] = PubSub.subscribe('togglePlay',togglePlaySub);
    this.nbSub++;
    var seekTimeSub = function(msg, data){
      if(data.origin!="audio") me.p.time.setCurrentTime(data.t);
    };
    this.sub[this.nbSub] = PubSub.subscribe('seekTime',seekTimeSub);
    this.nbSub++;
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
        { (this.state.url!='') ? (
          <div>
            <div className="waveform" id="waveform"></div>
            <audio id="audio" src={"https://flower.limsi.fr/"+this.state.url+".mp4"}/>
          </div>
        ) : (
          <div id="waveform" hidden></div>
        )}
      </div>
    );
  }
}

//--------------------------HEADER MODULE-----------------------------------------------
class Header extends React.Component {

  render() {
    return (
      <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <Title/>
            <Log/>
        </div>
      </div>
    );
  }
}

//--------------------------ANNOTATION MODULE-----------------------------------------
class Annotation extends React.Component {
  render(){
    return(
      <div className="container">
        <CorpusSelection/>
        <MediumSelection/>
        <VideoPlayer/>
        <Waveform/>
      </div>
    );
  }
}

//------------------------FOOTER MODULE------------------------------------------------
class Footer extends React.Component {
	render(){
		return(
			<div className="navbar navbar-fixed-bottom">
        <div className="container">
          <p className="text-muted credit"><a href="http://camomile.limsi.fr/">Camomile Project</a></p>
        </div>
      </div>
		);
	}
}

//--------------------------APPLICATION MODULE---------------------------------------------
class Application extends React.Component{

    constructor(){
      super();
      this.state = {
        authenticated: false
      };
      var sub;
    }

    componentDidMount(){
      var me = this;
      globalVar.callback2 = (data) => {
        this.setState({authenticated:data.isAuth});
        var logSub = function( msg, data ){
          me.setState({authenticated:data});
        };
        this.sub = PubSub.subscribe('isAuth',logSub);
      };
    }

    componentWillUnmount(){
      PubSub.unsubscribe(this.sub);
    }

  	render(){
  		return(
        <div>
  		    <Header></Header>
          { this.state.authenticated ? (
            <Annotation></Annotation>
          ) : (
            <div></div>
          )}
          <Footer></Footer>
        </div>
  		);
  	}
}


//------------------ FINAL RENDER -------------------------------------

ReactDOM.render(
	<Application/>,
	document.getElementById('wrap')
);