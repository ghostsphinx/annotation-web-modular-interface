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

//---------------------------LOGIN MODULE------------------------------------------
class Login extends React.Component{
  render(){
    return(
      <div name="login-window" autoComplete="on" className="navbar-form navbar-right">
        <div className="form-group">
          <input id="login" name="login" type="text" value={this.props.user} onChange={this.props.handleChangeUser.bind(this)} autoComplete="on" placeholder="Login" className="form-control" style={{width:160+'px'}}/>
        </div>
        <div className="form-group">
          <input id="password" name="password" type="password" value={this.props.password} onChange={this.props.handleChangePassword.bind(this)} onKeyUp={this.props.loginClick} autoComplete="on" placeholder="Password" className="form-control" style={{width:160+'px'}}/>
        </div>
          <button type="button" className="btn btn-success" onClick={this.props.login} >Sign in</button>
      </div>
    );
  }
}

//---------------------------------LOGOUT MODULE------------------------------------
class Logout extends React.Component{
  render(){
    return(
      <div>
        <form name="logout-form" autoComplete="on" className="navbar-form navbar-right">
          <button type="button" className="btn btn-danger" onClick={this.props.logout.bind(this)}>
            <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
            Logout
          </button>
        </form>
      </div>
    );
  }

}

//--------------------------HEADER MODULE-----------------------------------------------
class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      authenticated: localStorage.getItem('auth') ? true : false,
      user: '',
      password: ''
    }
  }

  handleChangeUser(e){
  	localStorage.removeItem('user');
  	localStorage.setItem('user',e.target.value);
  	this.setState({user: e.target.value});

  }

  handleChangePassword(e){
  	localStorage.removeItem('pwd');
    localStorage.setItem('pwd',e.target.value);
  	this.setState({password: e.target.value});
  }

  login() {
    this.props.login(localStorage.getItem('user'),localStorage.getItem('pwd'));
  }

  loginClick(e){
    if(e.keyCode==13) this.props.login(localStorage.getItem('user'),localStorage.getItem('pwd'));
  }

  logout() {
  	this.props.logout();
    localStorage.removeItem('auth');
    this.setState({authenticated: false});
    localStorage.removeItem('user');
    localStorage.removeItem('pwd');
    this.setState({user: ''});
    this.setState({password: ''});
  }

  render() {
    return (
      <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <Title/>
            <div className="navbar-collapse collapse">
                { !this.state.authenticated ? (
            		<Login user={this.state.user} password={this.state.password} login={this.login.bind(this)} loginClick={this.loginClick.bind(this)} handleChangeUser={this.handleChangeUser.bind(this)} handleChangePassword={this.handleChangePassword.bind(this)}/>
          		) : (
          			<Logout logout={this.logout.bind(this)}/>
      			)}
            </div>
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

//--------------------------CAMOMILE SUPER MODULE---------------------------------------------
class CamomileService extends React.Component{

	constructor(){
		super();
		localStorage.setItem('api','http://camomile.mediaeval.niderb.fr');
	}

	login(user,pwd) {
    	var blob = new Blob([JSON.stringify({'username': user,'password': pwd}, null, 2)], {type : 'application/json'});
    	var options = {
        	method: 'POST',
        	credentials: "include",
        	body: blob
   		};
   		var url = localStorage.getItem('api')+'/login';

    	var my = this;
      fetch(url,options)
    	.then(function(response){
    		var restext = response.text()
    		return restext;
      })
      .then(function(myresponse){
    			var res = JSON.parse(myresponse);
          var event = new Event("auth");
    			if (Object.keys(res)[0]!='error') {
    				console.log('logged in as ' + localStorage.getItem('user'));
    				localStorage.setItem('auth',localStorage.getItem('user'));
            my.refs.header.setState({authenticated:true});
    			}
    			else console.log('fail to log in');
    	});
  	}

  	logout() {
  		var options = {
        	method: 'POST',
        	credentials: "include"
    	};
    	fetch(localStorage.getItem('api')+'/logout',options, true)
    	.then(function(response){
    		console.log("logged out");
    	})
  	}

  	render(){
  		return(
        <div>
  		    <Header ref="header" login={this.login.bind(this)} logout={this.logout.bind(this)}></Header>
          <Footer></Footer>
        </div>
  		);
  	}
}

ReactDOM.render(
	<CamomileService/>,
	document.getElementById('wrap')
);

