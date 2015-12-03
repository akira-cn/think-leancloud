'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _cacheLeancloud = require('../cache/leancloud');

var _cacheLeancloud2 = _interopRequireDefault(_cacheLeancloud);

/**
 * base adapter
 */

var _default = (function (_think$adapter$base) {
  _inherits(_default, _think$adapter$base);

  function _default() {
    _classCallCheck(this, _default);

    _think$adapter$base.apply(this, arguments);
  }

  /**
   * init
   * @return {[]}         []
   */

  _default.prototype.init = function init(options) {
    options = think.parseConfig(options);

    this.timeout = options.timeout;
    this.cookie = options.cookie;

    this.isChanged = false;

    this.cache = new _cacheLeancloud2['default']({
      name: 'ThinkSession',
      timeout: this.timeout
    });

    this.gcType = 'session_leancloud';
    think.gc(this);
  };

  _default.prototype.getData = function getData() {
    return _regeneratorRuntime.async(function getData$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (this.data) {
            context$2$0.next = 4;
            break;
          }

          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(this.cache.get(this.cookie));

        case 3:
          this.data = context$2$0.sent;

        case 4:

          if (!this.data) {
            this.data = {};
          }

          return context$2$0.abrupt('return', this.data);

        case 6:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  _default.prototype.get = function get(name) {
    var data;
    return _regeneratorRuntime.async(function get$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.getData());

        case 2:
          data = context$2$0.sent;
          return context$2$0.abrupt('return', data[name]);

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  _default.prototype.set = function set(name, value) {
    var data;
    return _regeneratorRuntime.async(function set$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.getData());

        case 2:
          data = context$2$0.sent;

          data[name] = value;
          this.isChanged = true;

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  _default.prototype['delete'] = function _delete(name) {
    var data;
    return _regeneratorRuntime.async(function _delete$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.getData());

        case 2:
          data = context$2$0.sent;

          delete data[name];
          this.isChanged = true;

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  _default.prototype.flush = function flush() {
    return _regeneratorRuntime.async(function flush$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (this.isChanged) {
            this.cache.set(this.cookie, this.data);
          }

        case 1:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  _default.prototype.gc = function gc() {
    return _regeneratorRuntime.async(function gc$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          this.cache.gc();

        case 1:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  return _default;
})(think.adapter.base);

exports['default'] = _default;
module.exports = exports['default'];