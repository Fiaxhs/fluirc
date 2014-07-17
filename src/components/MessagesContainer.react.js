/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');
var MessageList = require('../components/MessageList.react');

var MessagesContainer = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var servers = this.props.servers,
      messagesLists = [];

    for (var servKey in servers){
      for (var key in servers[servKey].channels){
        messagesLists.push(<MessageList 
          key={key} 
          server_id={servKey} 
          channel_id={key} 
          messages={servers[servKey].channels[key].messages}
          focused={this.props.focused} />
        );
      }
    }

    return (
      <div id="messages-container">
        {messagesLists}
      </div>
    );
  }
});

module.exports = MessagesContainer;
