import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import Application from '../imports/ui/Application.jsx';

Meteor.startup(() => {
  render(<Application />, document.getElementById('wrap'));
});

