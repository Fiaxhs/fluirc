/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');
var Channel = require('./Channel.react');
var cx = require('react/lib/cx');

var ChannelList = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var server = this.props.server,
      focused = this.props.focused;
    var channels = [];

    var classes = cx({
      'servername': true,
      'active': focused.channel == null && focused.server == this.props.server.id
    });

    for (var key in server.channels) {
      channels.push(<Channel 
        key={key} 
        server_id={server.id} 
        channel={server.channels[key]} 
        focused={this.props.focused}  />);
    }

    return (
      <div className="channellist">
        <div className={classes} onClick={this._onClick}>{server.name}</div>
        {channels}
      </div>
    );
  },

  _onClick: function () {
    FluircActions.setFocusedChannel(this.props.server.id, null);
  }
});

module.exports = ChannelList;