/**
 * @jsx React.DOM
 */
var React = require('react');
var FluircActions = require('../actions/FluircActions');
var UserList = require('../components/UserList.react');

var UsersContainer = React.createClass({
  
  render: function() {
    var servers = this.props.servers,
      usersLists = [];

    for (var servKey in servers){
      for (var key in servers[servKey].channels){
        usersLists.push(<UserList 
          key={key} 
          server_id={servKey} 
          channel_id={key} 
          users={servers[servKey].channels[key].users}
          focused={this.props.focused} />
        );
      }
    }

    return (
      <div id="users-container">
        {usersLists}
      </div>
    );
  }
});

module.exports = UsersContainer;
