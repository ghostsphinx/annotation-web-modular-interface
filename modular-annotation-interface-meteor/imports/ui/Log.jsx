import React from 'react';
import PubSub from 'pubsub-js';

export default class Log extends React.Component{

  constructor(){
    super();
    this.state = {
      user: '',
      password: ''
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
    console.log(camService);
    /*camService.login(this.state.user,this.state.password,function(err,result){
      camService.me(function (err, data) {
        if (data.error) {
          document.getElementById("alert_log_failed").innerHTML = "Wrong login ";
        } else {
          document.getElementById("alert_log_failed").innerHTML = "";
          this.props.auth = true;
        }
      });
      if(err){
        console.log(err);
        return;
      }
      console.log(result);
    });*/
  }

  loginPress(e){
    if(e.keyCode==13){
      this.login();
    }
  }

  logout(){
    var me = this;
    /*camService.logout(function(){
      me.setState({authenticated:false});
      session.name = "";
      session.isAuth = me.state.authenticated;
      PubSub.publish('isAuth',false);
    });*/
  }

  render(){
    return(
      <div className="navbar-collapse collapse">
        { !this.props.auth ? (
          <div name="login-window" autoComplete="on" className="navbar-form navbar-right">
            <font id="alert_log_failed" color="red">
              {this.state.authenticated}
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