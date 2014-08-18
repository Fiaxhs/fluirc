/**
 * FluircActions
 */

var AppDispatcher = require('../dispatchers/AppDispatcher');
var FluircConstants = require('../constants/FluircConstants');

var FluircActions = {
  // Server
  createServer: function(options) {
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.CREATE_SERVER,
      options: options
    });
  },

  // Channel
  joinChannel: function(server_id, channel_id){
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.JOIN_CHANNEL,
      server_id: server_id,
      channel_id: channel_id
    });
  },

  setNames: function (names, server_id, channel_id){
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.SET_NAMES,
      names: names,
      server_id: server_id,
      channel_id: channel_id
    });
  },

  setFocusedChannel: function (server_id, channel_id){
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.SET_FOCUSED_CHANNEL,
      server_id: server_id,
      channel_id: channel_id
    });
  },

  handleMessage: function (nick, text, server_id, channel_id){
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.HANDLE_MESSAGE,
      nick: nick,
      text: text,
      server_id: server_id,
      channel_id: channel_id
    });
  },

  sendMessage: function (text, server_id, channel_id){
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.SEND_MESSAGE,
      text: text,
      server_id: server_id,
      channel_id: channel_id
    });
  },

  addUser: function (nick, server_id, channel_id){
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.ADD_USER,
      nick: nick,
      server_id: server_id,
      channel_id: channel_id
    });
  },

  removeUser: function (nick, server_id, channel_id){
    AppDispatcher.handleViewAction({
      actionType: FluircConstants.REMOVE_USER,
      nick: nick,
      server_id: server_id,
      channel_id: channel_id
    });
  }

};

module.exports = FluircActions;
