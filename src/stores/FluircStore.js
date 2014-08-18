/**
 * FluircStore
 */

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AppDispatcher = require('../dispatchers/AppDispatcher');
var FluircConstants = require('../constants/FluircConstants');
var FluircActions = require('../actions/FluircActions');

var FluircConnection = require('../components/FluircConnection');
var UtilsText = require('../utils/Text');
var keyMirror = require('react/lib/keyMirror');

var CHANGE_EVENT = 'change';

var _fluirc = {
  servers:{},
  focused: {
    server: null,
    channel: null
  },
  history: []
};

/*----- App data structure ----------------------------------*/
/*
App = {
  servers:{
    id: {
      id,
      nick,
      connection,
      name,
      messages: [{type, nick, txt, date}],
      last_seen: date,
      channels: {
        id:{
          id,
          users: {name:"role"},
          messages: [{type, nick, txt, date}, ...],
          last_seen: date
        },
        ...
      },
      mps: {
        id:{
          id,
          nick,
          messages: [{type, nick, txt, date}, ...],
          last_seen: date
        },
        ...
      }
    },
    ...
  },
  focused: {
    server: id | null,
    channel: id | null
  },
  history:["message said", ...]
}
*/


/*----- Server ----------------------------------*/
function createServer(options) {
  var id = Math.ceil(Math.random() * 100000);
  var connection = new FluircConnection(id, options);
  
  var serv = {
    id: id,
    nick: options.nick,
    connection: connection,
    name: options.name,
    messages: [],
    channels:{},
    mps:{}
  }

  _fluirc.servers[id] = serv;
}


function setNames(names, server_id, channel_id){
  _fluirc.servers[server_id].channels[channel_id].users = names;
}

/*----- Channels ----------------------------------*/
function joinChannel(server_id, channel_id){
  var connection = _fluirc.servers[server_id].connection;
    connection.join(channel_id);

  connection.addListener('join#' + channel_id, function (channel, nick){
    FluircActions.addUser(nick, server_id, channel_id);
  });

  connection.addListener('part#' + channel_id, function (channel, nick){
    FluircActions.removeUser(nick, server_id, channel_id);
  });

  var chan = {
    id: channel_id,
    users: {},
    messages: [],
    last_seen: 0
  };

  _fluirc.servers[server_id].channels[channel_id] = chan;
}

function setFocusedChannel(server_id, channel_id){
  _fluirc.focused = {server: server_id, channel: channel_id};
  if (channel_id) {
    _fluirc.servers[server_id].channels[channel_id].last_seen = Date.now();
  } else {
    _fluirc.servers[server_id].last_seen = Date.now();
  }
}


/*----- Users ----------------------------------*/

function removeUser(nick, server_id, channel_id){
  delete _fluirc.servers[server_id].channels[channel_id].users[nick];
  addMessage(null, '← ' + nick + ' left the channel.', server_id, channel_id);
}

function addUser(nick, server_id, channel_id){
  _fluirc.servers[server_id].channels[channel_id].users[nick] = "";
  addMessage(null, '→ ' + nick + ' joined the channel.', server_id, channel_id);
}

/*----- Messages ----------------------------------*/

function handleMessage(nick, text, server_id, channel_id){
  var server = _fluirc.servers[server_id];
  var channel = server.channels[channel_id];
  addMessage(nick, text, server_id, channel_id);

  if (server.id == _fluirc.focused.server && channel.id == _fluirc.focused.channel) {
    channel.last_seen = Date.now();
  }
}

function sendMessage(text, server_id, channel_id){
  if (text.substr(0, 1) == '/') {
    sendCommand(text, server_id, channel_id);
  } else {
    say(text, server_id, channel_id);
  }
}

function say(text, server_id, channel_id){
  var server = _fluirc.servers[server_id];

  server.connection.say(channel_id, text);
  addMessage(server.nick, text, server_id, channel_id);
  server.channel.last_seen = Date.now();
}

function addMessage(nick, text, server_id, channel_id) {
  var message = {
    nick: nick,
    text: text,
    date: Date.now()
  };

  _fluirc.servers[server_id].channels[channel_id].messages.push(message);
}

function sendCommand(text, server_id, channel_id){
  var knownCommands = keyMirror({'join': null, 'part': null}),
    command = text.substr(1, text.indexOf(' ') > 0 ? text.indexOf(' ') - 1 : 99999999).toLowerCase(); // that will do.
  if (knownCommands[command]) {
    text = text.substr(command.length + 1).trim();
    this['sendCommand' + command[0].toUpperCase() + command.slice(1)](text, server_id, channel_id);
    return;
  }
}

// Join command
sendCommandJoin = function(text, server_id, channel_id) {
  var chans = text.split(/\s+/),
    self = this;
  chans.forEach(function (chan){
    if (chan.substr(0,1) != '#') {
        chan = '#' + chan;
    }
    joinChannel(server_id, chan);
  });
};
// Part command
sendCommandPart = function(text, server_id, channel_id) {
  var chan = text.split(/\s+/)[0];
    if (chan == '') {
      chan = _fluirc.focused.channel;
      text = '';
    } else {
      text = text.slice(chan.length);
      if (chan.substr(0,1) != '#') {
        chan = '#' + chan;
      }
    }
    _fluirc.servers[server_id].connection.part(chan, text);
    delete(_fluirc.servers[server_id].channels[channel_id]);
    _fluirc.focused.channel = Object.keys(_fluirc.servers[server_id].channels)[0];
};
// me command
// sendCommandMe = function(text, server_id, channel_id) {
//     this.say("\x01ACTION " + text + "\x01");
// };
// // nick command
// sendCommandNick = function(text, server_id, channel_id) {
//     this.client.send('NICK', nick);
// };

// // names command
// sendCommandNames = function(text, server_id, channel_id) {
//     this.client.send('NAMES', message);
// };


/*----- Actual store ----------------------------------*/
var FluircStore = merge(EventEmitter.prototype, {
  getAll: function() {
    return _fluirc;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  hasChannel: function (server_id, channel_id){
    return !!(_fluirc.servers[server_id] && _fluirc.servers[server_id].channels[channel_id]);
  }
});






/*----- Register ----------------------------------*/
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {

    case FluircConstants.CREATE_SERVER:
      createServer(action.options);
    break;

    case FluircConstants.JOIN_CHANNEL:
      joinChannel(action.server_id, action.channel_id);
    break;

    case FluircConstants.SET_NAMES:
      setNames(action.names, action.server_id, action.channel_id);
    break;

    case FluircConstants.SET_FOCUSED_CHANNEL:
      setFocusedChannel(action.server_id, action.channel_id);
    break;

    case FluircConstants.HANDLE_MESSAGE:
      handleMessage(action.nick, action.text, action.server_id, action.channel_id);
    break;

    case FluircConstants.SEND_MESSAGE:
      sendMessage(action.text, action.server_id, action.channel_id);
    break;

    case FluircConstants.ADD_USER:
      addUser(action.nick, action.server_id, action.channel_id);
    break;

    case FluircConstants.REMOVE_USER:
      removeUser(action.nick, action.server_id, action.channel_id);
    break;

    default:
      return true;
  }
  FluircStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = FluircStore;