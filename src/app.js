/**
 * @jsx React.DOM
 */

global.document = window.document;
var React = require('react');
var FluircApp = require('./js/components/FluircApp.react');
var gui = require('nw.gui');
var win = gui.Window.get();

var FluircActions = require('./js/actions/FluircActions');


React.renderComponent(
  <FluircApp />,
  document.getElementById('fluirc')
);

// TODO read from config
// Sample connect for now
// FluircActions.createServer({
//   host: 'host.com',
//   name: 'Display name',
//   nick: 'yournick',
//   floodProtection: true,
//   floodProtectionDelay: 1000,
//   channels: []
// });