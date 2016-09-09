class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      authenticated: localStorage.getItem('auth') ? true : false,
      user: '',
      password: ''
    }
    this.login = this.login.bind(this);
    this.loginClick = this.loginClick.bind(this);
    this.logout = this.logout.bind(this);
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
            		<div name="login-window" autoComplete="on" className="navbar-form navbar-right">
                		<div className="form-group">
                			<input id="login" name="login" type="text" value={this.state.user} onChange={this.handleChangeUser.bind(this)} autoComplete="on" placeholder="Login" className="form-control" style={{width:160+'px'}}/>
                		</div>
                		<div className="form-group">
                    		<input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChangePassword.bind(this)} onKeyUp={this.loginClick} autoComplete="on" placeholder="Password" className="form-control" style={{width:160+'px'}}/>
                		</div>
                		<button type="button" className="btn btn-success" onClick={this.login} >Sign in</button>
            		</div>
          		) : (
          			<form name="logout-form" autoComplete="on" className="navbar-form navbar-right">
            			<button type="button" className="btn btn-danger" onClick={this.logout}>
                			<span className="glyphicon glyphicon-off" aria-hidden="true"></span>
                			Logout
            			</button>
            		</form>
      			)}
            </div>
        </div>
      </div>
    );
  }
}