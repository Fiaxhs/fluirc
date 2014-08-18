/**
 * @jsx React.DOM
 */
var React = require('react');
var moment = require('moment');
var FluircActions = require('../actions/FluircActions');


// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) + '';
};

var Message = React.createClass({

  /**
   * @return {object}
   */
  
  render: function() {
    var message = this.props.message;

    var nick = "";
    if (message.nick) {
      var classNames = "nick nick_" + message.nick.hashCode().charAt(0);
      nick = <span className={classNames}>{message.nick}</span>;
    }

    return (
      <div className="message">
        <span>[{moment.unix(Math.ceil(message.date/1000)).format("HH:mm:ss")}]</span> {nick} {message.text}
      </div>
    );
  }
});

module.exports = Message;
