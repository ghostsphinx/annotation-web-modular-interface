var React = require('react');
var PubSub = require('pubsub-js');
var camomile = require ('./init.js');

module.exports = React.createClass({

  sub: {},

  nbSub: 0,

  getInitialState: function(){
    return {
      corpus_id:''
    };
  },

  componentDidMount: function(){
    var option = document.createElement("option");
    option.value = 1;
    option.innerHTML = "--Choose a medium--";
    document.getElementById("medium_selection").appendChild(option);
    var me = this;
    var corpusSub = function( msg, data ){
      me.setState({corpus_id:data});
      if(me.state.corpus_id=='') PubSub.publish(me.props.layer+'.medium_url', '');
    };
    this.sub[this.nbSub] = PubSub.subscribe(me.props.layer+'.corpus_id',corpusSub);
    this.nbSub++;
  },

  componentWillUnmount: function(){
    var i;
    for (i=this.nbSub-1; i>=0; i--){
      PubSub.unsubscribe(this.sub[i]);
    }
  },

  componentDidUpdate: function(prevProps, prevState){
    var options = {filter:{id_corpus:''}};
    if(this.state.corpus_id!='' && prevState.corpus_id==''){
      options.filter.id_corpus = this.state.corpus_id;
      camomile.then(function(camomile){
        camomile.getMedia(options, function(data){
          return data;
        })
        .then(function(data){
          var i;
          for(i = 1; i < data.length; i++){
            var option = document.createElement("option");
            option.value = i+1;
            option.innerHTML = data[i].name;
            document.getElementById("medium_selection").appendChild(option);
          }
        });
      });
    }
    else{
      var i;
      for(i = document.getElementById("medium_selection").options.length -1 ; i > 0; i--){
        document.getElementById("medium_selection").remove(i);
      }
      if(this.state.corpus_id!=''){
        options.filter.id_corpus = this.state.corpus_id;
        camomile.then(function(camomile){
        camomile.getMedia(options, function(data){
          return data;
        })
        .then(function(data){
          var i;
          for(i = 1; i < data.length; i++){
            var option = document.createElement("option");
            option.value = i+1;
            option.innerHTML = data[i].name;
            document.getElementById("medium_selection").appendChild(option);
          }
        });
      });
      }
    }
  },

  handleChangeMedium: function(event){
    var val = event.target.value-1;
    var options = {filter:{corpus_id:''}};
    var me = this;
    if(val>0){
      options.filter.id_corpus = this.state.corpus_id;
      camomile.then(function(camomile){
        camomile.getMedia(options, function(data){
          return data;
        })
        .then(function(data){
          PubSub.publish(me.props.layer+'.medium_url', data[val].url);
        });
      });
    }
    else PubSub.publish(me.props.layer+'.medium_url', '');
  },

  render: function(){
    return(
      <form>
        <select id="medium_selection" onChange={this.handleChangeMedium}>
        </select>
      </form>
    );
  }
});