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

  componentWillMount(){
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
    var options = {};
    options.filter = "name";
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
    }

    componentDidMount(){
      var me = this;
      globalVar.callback2 = (data) => {
        this.setState({authenticated:data.isAuth});
        var logSub = function( msg, data ){
          me.setState({authenticated:data});
        };
        PubSub.subscribe('isAuth',logSub);
      };
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