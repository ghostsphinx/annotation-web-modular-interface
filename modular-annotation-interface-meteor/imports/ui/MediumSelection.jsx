import React from 'react';
import PubSub from 'pubsub-js';

export default class MediumSelection extends React.Component {

  constructor(){
    super();
    this.state = {
      corpus_id:''
    };
    var sub;
    this.handleChangeMedium = this.handleChangeMedium.bind(this);
  }

  componentDidMount(){
    var option = document.createElement("option");
    option.value = 1;
    option.innerHTML = "--Choose a medium--";
    document.getElementById("medium_selection").appendChild(option);
    var me = this;
    var corpusSub = function( msg, data ){
      me.setState({corpus_id:data});
      if(me.state.corpus_id=='') PubSub.publish(me.props.layer+'.medium_url', '');
    };
    this.sub = PubSub.subscribe(me.props.layer+'.corpus_id',corpusSub);
  }

  componentWillUnmount(){
    PubSub.unsubscribe(this.sub);
  }

  componentDidUpdate(prevProps, prevState){
    var options = {filter:{corpus_id:''}};
    if(this.state.corpus_id!='' && prevState.corpus_id==''){
      options.filter.id_corpus = this.state.corpus_id;
      Camomile.getMedia(function(err, data){
        var i;
        for(i = 1; i < data.length; i++){
          var option = document.createElement("option");
          option.value = i+1;
          option.innerHTML = data[i].name;
          document.getElementById("medium_selection").appendChild(option);
        }
      },options);
    }
    else{
      var i;
      for(i = document.getElementById("medium_selection").options.length -1 ; i > 0; i--){
        document.getElementById("medium_selection").remove(i);
      }
      if(this.state.corpus_id!=''){
        options.filter.id_corpus = this.state.corpus_id;
        Camomile.getMedia(function(err, data){
          var i;
          for(i = 0; i < data.length; i++){
            var option = document.createElement("option");
            option.value = i+1;
            option.innerHTML = data[i].name;
            document.getElementById("medium_selection").appendChild(option);
          }
        },options);
      }
    }
  }

  handleChangeMedium(event){
    var val = event.target.value-1;
    var options = {filter:{corpus_id:''}};
    var me = this;
    if(val>0){
      options.filter.id_corpus = this.state.corpus_id;
      Camomile.getMedia(function(err, data){
        PubSub.publish(me.props.layer+'.medium_url', data[val].url);
      },options);
    }
    else PubSub.publish(me.props.layer+'.medium_url', '');
  }

  render(){
    return(
      <form>
        <select id="medium_selection" onChange={this.handleChangeMedium}>
        </select>
      </form>
    );
  }
}