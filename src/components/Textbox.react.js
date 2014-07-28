/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');

var Textbox = React.createClass({

  /**
   * @return {object}
   */
  render: function() {

    return (
      <div id="textbox-container" editable="true">
        <div id="textbox-left"></div>
        <div id="textbox-center">
            <input type="text" id="textbox" placeholder="Type a message..." onKeyPress={this._onKeyPress} />
        </div>
        <div id="textbox-right"></div>
      </div>
    );
  },

  _onKeyPress: function (e) {
    if (e.key == 'Enter') {
      FluircActions.sendMessage(e.target.value, this.props.focused.server, this.props.focused.channel);
      e.target.value = '';
    }
  }
});

module.exports = Textbox;
