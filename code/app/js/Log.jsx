var React = require('react');
var PubSub = require('pubsub-js');

var camomile = require('./init.js');

module.exports = React.createClass({

  getInitialState: function(){
    return {
      user: '',
      password: ''
    };
  },

  handleChangeUser: function(e){
    this.setState({user: e.target.value});

  },

  handleChangePassword: function(e){
    this.setState({password: e.target.value});
  },

  login: function(){
    var me = this;
    camomile.then(function(camomile){
      camomile.login(me.state.user,me.state.password,function(data){
        return data;
      })
      .then(function(data){
        document.getElementById("alert_log_failed").innerHTML = "";
        me.setState({authenticated:true, password:''});
        PubSub.publish('isAuth',true);
      }).catch(function(e){
        if (e.statusCode==401) document.getElementById("alert_log_failed").innerHTML = "Wrong login ";
      });
    });
  },

  loginPress: function(e){
    if(e.keyCode==13){
      this.login();
    }
  },

  logout: function(){
    var me = this;
    camomile.then(function(camomile){
      camomile.logout()
      .then(function(){
        me.setState({authenticated:false});
        PubSub.publish('isAuth',false);
      });
    })
  },

  render: function(){
    return(
      <div className="navbar-collapse collapse">
        { !this.props.auth ? (
          <div name="login-window" autoComplete="on" className="navbar-form navbar-right">
            <font id="alert_log_failed" color="red">
              {this.state.authenticated}
            </font>
            <div className="form-group">
              <input id="login" name="login" type="text" value={this.state.user} onChange={this.handleChangeUser} autoComplete="on" placeholder="Login" className="form-control" style={{width:160+'px'}}/>
            </div>
            <div className="form-group">
              <input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChangePassword} onKeyUp={this.loginPress} autoComplete="on" placeholder="Password" className="form-control" style={{width:160+'px'}}/>
            </div>
            <button type="button" className="btn btn-success" onClick={this.login} >Sign in</button>
          </div>
        ) : (
          <div>
            <form name="logout-form" autoComplete="on" className="navbar-form navbar-right">
              <font color="white">
                {this.state.user+' '}
              </font>
              <button type="button" className="btn btn-danger" onClick={this.logout}>
                <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
});