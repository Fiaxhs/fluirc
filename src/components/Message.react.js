/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');

var Message = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var message = this.props.message;
    return (
      <div className="message">
        <span className="nickname">{message.nick}</span> 
        {message.text}
      </div>
    );
  }
});

module.exports = Message;
