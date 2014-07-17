/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');
var ChannelList = require('./ChannelList.react');

var ServersContainer = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var servers = this.props.servers;
    var serverItems = [];

    for (var key in servers) {
      serverItems.push(<ChannelList key={key} server={servers[key]} focused={this.props.focused} />);
    }

    return (
      <div id="servers-container">
        {serverItems}
      </div>
    );
  }
});

module.exports = ServersContainer;