var React = require('react');
var PubSub = require('pubsub-js');
var camomile = require('./init.js');

module.exports = React.createClass({

  componentDidMount: function(){
    var option = document.createElement("option");
    option.value = 1;
    option.innerHTML = "--Choose a corpus--";
    document.getElementById("corpus_selection").appendChild(option);
    camomile.then(function(camomile){
      camomile.getCorpora(function(data){
        return data;
      })
      .then(function(data){
        var i;
        for(i = 1; i < data.length; i++){
          var option = document.createElement("option");
          option.value = i+1;
          option.innerHTML = data[i].name;
          document.getElementById("corpus_selection").appendChild(option);
        }
      });
    })
  },

  handleChangeCorpus: function(event){
    var val = event.target.value-1;
    var me = this;
    if(val>0){
      camomile.then(function(camomile){
        camomile.getCorpora(function(data){
          return data;
        })
        .then(function(data){
          PubSub.publish(me.props.layer+'.corpus_id', data[val]._id);
        });
      });
    }
    else {
      PubSub.publish(me.props.layer+'.corpus_id', '');
    }
  },

  render: function(){
    return(
      <form>
        <select id="corpus_selection" onChange={this.handleChangeCorpus}>
        </select>
      </form>
    );
  }
});