import React from 'react';

export default class Footer extends React.Component {
	render(){
		return(
			<div className="navbar navbar-fixed-bottom">
        <div className="container">
          <p className="text-muted credit"><a href="http://camomile.limsi.fr/">Camomile Project</a></p>
        </div>
      </div>
		);
	}
}