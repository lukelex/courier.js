// ==========================================================================
// Project:   Courier.js - Simple messaging engine for JavaScript
// Copyright: Copyright 2015 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/lukelex/courier.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.4.0 | From: 11-4-2015

"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

(function (window) {
  var Courier = (function () {
    function Courier() {
      _classCallCheck(this, Courier);

      this.subscriptions = {};
    }

    _createClass(Courier, [{
      key: "receive",
      value: function receive(box, opener) {
        var subscription = new Subscription(box, opener);

        this.subscriptions[box] = this.subscriptions[box] || [];
        this.subscriptions[box].push(subscription);

        return unsubscribe.bind(this, subscription);
      }
    }, {
      key: "send",
      value: function send(box, message, options, callback) {
        callback = is(options, "Function") ? options : callback || function () {};
        options = is(options, "Object") ? options : { throwOnMissing: true };

        new BoxFinder(this.subscriptions).withName("all", andPassAlongThe(box, callback)).dispatch(box, { throwOnMissing: false }).withName(box, andPassAlongThe(message, callback)).dispatch(box, options);
      }
    }, {
      key: "reset",
      value: function reset() {
        this.subscriptions = {};
      }
    }]);

    return Courier;
  })();

  var Subscription = function Subscription(box, handler) {
    _classCallCheck(this, Subscription);

    this.id = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.box = stringify(box);
    this.handler = handler;
  };

  var BoxFinder = (function () {
    function BoxFinder(subscriptions) {
      _classCallCheck(this, BoxFinder);

      this.subscriptions = subscriptions;
    }

    _createClass(BoxFinder, [{
      key: "withName",
      value: function withName(box, callback) {
        var senderPattern = new RegExp(box),
            receiverPattern,
            receivers = [];

        for (var name in this.subscriptions) {
          receiverPattern = new RegExp(stringify(name));

          if (senderPattern.exec(stringify(name)) || receiverPattern.exec(stringify(box))) {
            receivers.push(this.subscriptions[name]);
          }
        }

        return new ReceiverIterator(receivers, callback, this);
      }
    }]);

    return BoxFinder;
  })();

  var ReceiverIterator = (function () {
    function ReceiverIterator(receivers, callback, context) {
      _classCallCheck(this, ReceiverIterator);

      this.receivers = receivers;
      this.callback = callback;
      this.context = context;
    }

    _createClass(ReceiverIterator, [{
      key: "dispatch",
      value: function dispatch(box, options) {
        var _this = this;

        if (this.receivers.length === 0 && options.throwOnMissing === true) {
          throw "Courier: No receiver registered for '" + box + "'";
        }

        this.receivers.forEach(function (receiver) {
          _this.callback(receiver);
        });

        return this.context;
      }
    }]);

    return ReceiverIterator;
  })();

  function unsubscribe(subscription) {
    this.subscriptions[subscription.box] = this.subscriptions[subscription.box].filter(function (subs) {
      return subs.id !== subscription.id;
    });

    if (this.subscriptions[subscription.box].length === 0) {
      delete this.subscriptions[subscription.box];
    }
  }

  function stringify(name) {
    return name.toString().replace(/(^\/|\/$)/g, "");
  }

  function andPassAlongThe(message, callback) {
    var results = [];

    return function (subscriptions) {
      subscriptions.forEach(function (subscription) {
        results.push(subscription.handler(message));
      });

      return callback(results);
    };
  }

  function is(func, type) {
    return func && ({}).toString.call(func) === "[object " + type + "]";
  }

  window.Courier = Courier;
})(window);