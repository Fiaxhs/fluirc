/**
 * FluircStore
 */

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AppDispatcher = require('../dispatchers/AppDispatcher');
var FluircConstants = require('../constants/FluircConstants');
var FluircActions = require('../actions/FluircActions');

var FluircConnection = require('../components/FluircConnection');

var CHANGE_EVENT = 'change';

var _fluirc = {
  servers:{},
  focused: true,
  active_channel: null
};

/*----- App data structure ----------------------------------*/
/*
App = {
  servers:{
    id: {
      id,
      connection,
      name,
      messages: [{type, nick, txt, date}],
      channels: {
        id:{
          id,
          users: [{name, role}],
          messages: [{type, nick, txt, date}]
        },
        id:{...}
      },
      mps: {
        id:{
          id,
          nick,
          messages: [{type, nick, txt, date}]
        },
        id:{...}
      }
    }
  },
  focused: {
    server: id | null,
    channel: id | null
  }
}
*/


/*----- Server ----------------------------------*/
function createServer(options) {
  var id = Math.ceil(Math.random() * 100000);
  var connection = new FluircConnection(id, options);
  
  var serv = {
    id: id,
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

  var chan = {
    id: channel_id,
    users: [],
    messages: []
  };

  _fluirc.servers[server_id].channels[channel_id] = chan;
}

function setFocusedChannel(server_id, channel_id){
  _fluirc.focused = {server: server_id, channel: channel_id};
}


/*----- Messages ----------------------------------*/

function handleMessage(nick, text, server_id, channel_id){
  var message = {
    nick: nick,
    text: text
  }

  _fluirc.servers[server_id].channels[channel_id].messages.push(message);
}



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

    default:
      return true;
  }
  FluircStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = FluircStore;