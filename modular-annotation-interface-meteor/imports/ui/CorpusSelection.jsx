import React from 'react';
import PubSub from 'pubsub-js';

export default class CorpusSelection extends React.Component {

  constructor(){
    super();
    this.handleChangeCorpus = this.handleChangeCorpus.bind(this);
  }

  componentDidMount(){
    var option = document.createElement("option");
    option.value = 1;
    option.innerHTML = "--Choose a corpus--";
    document.getElementById("corpus_selection").appendChild(option);
    Camomile.getCorpora(function(err, data){
      var i;
      for(i = 1; i < data.length; i++){
        var option = document.createElement("option");
        option.value = i+1;
        option.innerHTML = data[i].name;
        document.getElementById("corpus_selection").appendChild(option);
      }
    });
  }

  handleChangeCorpus(event){
    var val = event.target.value-1;
    var me= this;
    if(val>0){
      Camomile.getCorpora(function(err, data){
        PubSub.publish(me.props.layer+'.corpus_id', data[val]._id);
      });
    }
    else {
      PubSub.publish(me.props.layer+'.corpus_id', '');
    }
  }

  render(){
    return(
      <form>
        <select id="corpus_selection" onChange={this.handleChangeCorpus}>
        </select>
      </form>
    );
  }
}