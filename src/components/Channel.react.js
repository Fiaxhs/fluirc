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

    var classes = cx({
      'channel': true,
      'active': focused.channel == channel.id && focused.server == this.props.server_id
    });

    return (
      <div className={classes} onClick={this._onClick}>
        {channel.id}
        <span className="unread">0</span>
      </div>
    );
  },

  _onClick: function () {
    FluircActions.setFocusedChannel(this.props.server_id, this.props.channel.id);
  }
});

module.exports = Channel;