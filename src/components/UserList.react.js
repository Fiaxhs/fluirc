/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');
var cx = require('react/lib/cx');

var UserList = React.createClass({
  
  render: function() {
    var users = this.props.users,
      focused = this.props.focused;
    var usrs = [];

    var classes = cx({
      'userlist': true,
      'show': focused.channel == this.props.channel_id && focused.server == this.props.server_id
    });

    for (var key in users){
      usrs.push(<div className="nickname" key={key}>{users[key]} {key}</div>);
    }
    
    return (
      <div className={classes}>
        {usrs}
      </div>
    );
  }
});

module.exports = UserList;
