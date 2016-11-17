sudimport React from 'react';

import CorpusSelection from './CorpusSelection.jsx';
import MediumSelection from './MediumSelection.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import Waveform from './Waveform.jsx';

export default class Annotation extends React.Component {
  render(){
    return(
      <div className="container">
        <CorpusSelection layer="layer1"/>
        <MediumSelection layer="layer1"/>
        <VideoPlayer id="video" layer="layer1"/>
        <Waveform id="audio" layer="layer1"/>
      </div>
    );
  }
}