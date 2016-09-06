class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      authenticated: localStorage.getItem('auth') ? true : false,
      user: '',
      password: ''
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.reveal = this.reveal.bind(this);
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

  logout() {
  	this.props.logout();
    localStorage.removeItem('auth');
    this.setState({authenticated: false});
    this.setState({user: ''});
    this.setState({password: ''});
  }

  reveal(){
  	console.log("auth: "+localStorage.getItem("auth"));
  }

  render() {
    return (
      <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#">MediaEval Frontend Dev</a>
            </div>
            <div className="navbar-collapse collapse">
                { !this.state.authenticated ? (
            		<form name="login-form" autoComplete="on" className="navbar-form navbar-right" method="post">
                		<div className="form-group">
                			<input id="login" name="login" type="text" value={this.state.user} onChange={this.handleChangeUser.bind(this)} autoComplete="on" placeholder="Login" className="form-control" style={{width:160+'px'}}/>
                		</div>
                		<div className="form-group">
                    		<input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChangePassword.bind(this)} autoComplete="on" placeholder="Password" className="form-control" style={{width:160+'px'}}/>
                		</div>
                		<button type="submit" className="btn btn-success" onClick={this.login}>Sign in</button>
            		</form>
          		) : (
          			<form name="logout-form" autoComplete="on" className="navbar-form navbar-right">
            			<button type="submit" className="btn btn-danger" onClick={this.logout}>
                			<span className="glyphicon glyphicon-off" aria-hidden="true"></span>
                			Logout
            			</button>
            		</form>
      			)}
      			<button onClick={this.reveal}> Reveal</button>
            </div>
        </div>
      </div>
    );
  }
}


class Footer extends React.Component {
	render(){
		return(
			<div class="container">
            	<p class="text-muted credit"><a href="http://camomile.limsi.fr/">Camomile Project</a></p>
        	</div>
		);
	}
}

class CamomileService extends React.Component{

	constructor(){
		super();
		localStorage.setItem('api','http://camomile.mediaeval.niderb.fr')
	}

	login(user,pwd) {
    	var blob = new Blob([JSON.stringify({'username': user,'password': pwd}, null, 2)], {type : 'application/json'});
    	var options = {
        	method: 'POST',
        	credentials: "include",
        	body: blob
   		};
   		var url = localStorage.getItem('api')+'/login';
    	var req = fetch(url,options)

    	.then(function(response){
    		console.log("response: "+response);
    		var restext = response.text()
    		console.log("response.text(): "+restext);
    		return restext;

    	})

    	.then(function(myresponse){
    		console.log("text response: "+myresponse);
    		var res = JSON.parse(myresponse);
    		console.log("parsed response: "+res.success);
    		if (Object.keys(res)[0]!='error') {
    			console.log("success log");
    			console.log('logged in as ' + localStorage.getItem('user'));
    			localStorage.setItem('auth',localStorage.getItem('user'));
    			localStorage.removeItem('user');
    			localStorage.removeItem('pwd');
    		}
    		else console.log('fail to log in');
    	})
    	.catch(console.log.bind(console));

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
  			<Header login={this.login} logout={this.logout.bind(this)}/>
  		);
  	}
}

class GlobalInterface extends React.Component {

	render(){
		return(
			<CamomileService/>
		);
	}
}

ReactDOM.render(
	<CamomileService/>,
	document.getElementById('wrap')
);

