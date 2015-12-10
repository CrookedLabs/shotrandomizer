var React = require('react');

window.jQuery = window.$ = require('jquery');
require('velocity-animate');
React.initializeTouchEvents(true);

var App = require('./src/js/app.jsx');

window.React = React;

// Render app to body#main
React.render(<App />, document.getElementById('main'));
