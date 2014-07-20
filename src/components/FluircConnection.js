var irc = require('irc');
var FluircActions = require('../actions/FluircActions');
var id;

function FluircConnection (server_id, options) {
  var id = server_id;
  var connection = new irc.Client(options.host, options.nick, options);

  connection.addListener('raw', function(message){
    // console.log(message);
  });

  connection.addListener('error', function(message) {
    console.log('error: ', message);
  });

  connection.addListener('registered', function() {
    options.channels.forEach(function (channel) {
      FluircActions.joinChannel(id, channel);
    })
  });

  connection.addListener('names', function (channel, names){
    FluircActions.setNames(names, id, channel);
  });

  connection.addListener('message#', function (nick, to, text, message){
    FluircActions.handleMessage(nick, text, id, to);
  });

  return connection;
}

module.exports = FluircConnection;