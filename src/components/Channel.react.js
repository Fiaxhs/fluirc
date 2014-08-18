/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');
var cx = require('react/lib/cx');

var Channel = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var channel = this.props.channel
      focused = this.props.focused;

    var active = focused.channel == channel.id && focused.server == this.props.server_id;
    var classes = cx({
      'channel': true,
      'active': active
    });

    var unread = 0;
    for (var message in channel.messages) {
      if (channel.messages[message].date > channel.last_seen) {
        unread++;
      }
    }

    var unreadClasses = cx({
      "unread": true,
      "hidden": active || unread == 0
    });

    return (
      <div className={classes} onClick={this._onClick}>
        {channel.id}
        <span className={unreadClasses}>{unread}</span>
      </div>
    );
  },

  _onClick: function () {
    FluircActions.setFocusedChannel(this.props.server_id, this.props.channel.id);
  }
});

module.exports = Channel;