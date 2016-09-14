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
    globalVar.callback = (data) => {
      this.setState({authenticated:data.isAuth, user:data.name});     
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
      console.log("login success");
      me.setState({authenticated:true});
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
      console.log("logout success");
      me.setState({authenticated:false});
    });
  }

  render(){
    return(
      <div className="navbar-collapse collapse">
        { !this.state.authenticated ? (
          <div name="login-window" autoComplete="on" className="navbar-form navbar-right">
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

//------------------------FOOTER MODULE------------------------------------------------
class Footer extends React.Component {
	render(){
		return(
			<div className="container">
        <p className="text-muted credit"><a href="http://camomile.limsi.fr/">Camomile Project</a></p>
      </div>
		);
	}
}

//--------------------------APPLICATION MODULE---------------------------------------------
class Application extends React.Component{

  	render(){
  		return(
        <div>
  		    <Header></Header>
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

