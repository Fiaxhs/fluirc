/**
 * @jsx React.DOM
 */
var React = require('react');

var FluircStore = require('../stores/FluircStore');
var ServersContainer = require('./ServersContainer.react');
var MessagesContainer = require('./MessagesContainer.react');
var UsersContainer = require('./UsersContainer.react');
var Textbox = require('./Textbox.react');

function getState() {
  return FluircStore.getAll();
}

var FluircApp = React.createClass({

  componentDidMount: function() {
    FluircStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    FluircStore.removeChangeListener(this._onChange);
  },

  getInitialState: function() {
    return getState();
  },
  /**
   * @return {object}
   */
  render: function() {
    return (
      <div id="wrapper" onKeyDown={this._keyPress}>
        <div id="main">
          <ServersContainer servers={this.state.servers} focused={this.state.focused} />
          <MessagesContainer servers={this.state.servers} focused={this.state.focused} />
          <UsersContainer servers={this.state.servers} focused={this.state.focused} />
        </div>
        <Textbox history={this.state.history} focused={this.state.focused} />
      </div>
    );
  },

    /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getState());
  }
});

module.exports = FluircApp;
