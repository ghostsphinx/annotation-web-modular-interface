var React = require('react');

var CorpusSelection = require('./CorpusSelection.jsx');
var MediumSelection = require('./MediumSelection.jsx');
var VideoPlayer = require('./VideoPlayer.jsx');
var Waveform = require('./Waveform.jsx');

module.exports = React.createClass({
  render: function(){
    return(
      <div className="container">
        <CorpusSelection layer="layer1"/>
        <MediumSelection layer="layer1"/>
        <VideoPlayer id="video" layer="layer1"/>
        <Waveform id="audio" layer="layer1"/>
      </div>
    );
  }
});