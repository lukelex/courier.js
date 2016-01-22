// ==========================================================================
// Project:   Courier.js - Simple messaging engine for JavaScript
// Copyright: Copyright 2015 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/lukelex/courier.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.5.0 | From: 22-1-2016

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Courier = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscription = require('./lib/Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var _BoxFinder = require('./lib/BoxFinder');

var _BoxFinder2 = _interopRequireDefault(_BoxFinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function unsubscribe(subscription) {
  this.subscriptions[subscription.box] = this.subscriptions[subscription.box].filter(function (subs) {
    return subs.id !== subscription.id;
  });

  if (this.subscriptions[subscription.box].length === 0) {
    delete this.subscriptions[subscription.box];
  }
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
  return func && {}.toString.call(func) === "[object " + type + "]";
}

var Courier = function () {
  function Courier() {
    _classCallCheck(this, Courier);

    this.subscriptions = {};
  }

  _createClass(Courier, [{
    key: 'receive',
    value: function receive(box, opener) {
      var subscription = new _Subscription2.default(box, opener);

      this.subscriptions[box] = this.subscriptions[box] || [];
      this.subscriptions[box].push(subscription);

      return unsubscribe.bind(this, subscription);
    }
  }, {
    key: 'send',
    value: function send(box, message, options, callback) {
      callback = is(options, "Function") ? options : callback || function () {};
      options = is(options, "Object") ? options : { throwOnMissing: true };

      new _BoxFinder2.default(this.subscriptions).withName("all", andPassAlongThe(box, callback)).dispatch(box, { throwOnMissing: false }).withName(box, andPassAlongThe(message, callback)).dispatch(box, options);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.subscriptions = {};
    }
  }]);

  return Courier;
}();

// Using CommonJS module exporting to prevent
// Babel to wrap it in 'default' property of the module

module.exports = Courier;

},{"./lib/BoxFinder":2,"./lib/Subscription":4}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ReceiverIterator = require('./ReceiverIterator');

var _ReceiverIterator2 = _interopRequireDefault(_ReceiverIterator);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoxFinder = function () {
  function BoxFinder(subscriptions) {
    _classCallCheck(this, BoxFinder);

    this.subscriptions = subscriptions;
  }

  _createClass(BoxFinder, [{
    key: 'withName',
    value: function withName(box, callback) {
      var senderPattern = new RegExp(box),
          receiverPattern,
          receivers = [];

      for (var name in this.subscriptions) {
        receiverPattern = new RegExp((0, _helpers.stringify)(name));

        if (senderPattern.exec((0, _helpers.stringify)(name)) || receiverPattern.exec((0, _helpers.stringify)(box))) {
          receivers.push(this.subscriptions[name]);
        }
      }

      return new _ReceiverIterator2.default(receivers, callback, this);
    }
  }]);

  return BoxFinder;
}();

exports.default = BoxFinder;

},{"./ReceiverIterator":3,"./helpers":5}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReceiverIterator = function () {
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
}();

exports.default = ReceiverIterator;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subscription = function Subscription(box, handler) {
  _classCallCheck(this, Subscription);

  this.id = "#" + Math.floor(Math.random() * 16777215).toString(16);
  this.box = (0, _helpers.stringify)(box);
  this.handler = handler;
};

exports.default = Subscription;

},{"./helpers":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = stringify;
function stringify(name) {
  return name.toString().replace(/(^\/|\/$)/g, "");
}

},{}]},{},[1])(1)
});