var React = require('react');

var Title = require('./Title.jsx');
var Log = require('./Log.jsx');

module.exports = React.createClass({

  render: function() {
    return (
      <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <Title/>
            <Log auth={this.props.auth}/>
        </div>
      </div>
    );
  }
});