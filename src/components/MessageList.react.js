/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');
var Message = require('../components/Message.react');
var cx = require('react/lib/cx');

var MessageList = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var messages = this.props.messages,
      focused = this.props.focused;

    var msgs = [];

    for (var key in messages){
      msgs.push(<Message key={key} message={messages[key]} />);
    }

    var classes = cx({
      'messages': true,
      'show': focused.channel == this.props.channel_id && focused.server == this.props.server_id
    });

    return (
      <div className={classes}>
        {msgs}
      </div>
    );
  }
});

module.exports = MessageList;
