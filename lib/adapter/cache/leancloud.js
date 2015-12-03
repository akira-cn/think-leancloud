'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _storeLeancloud = require('../store/leancloud');

var _storeLeancloud2 = _interopRequireDefault(_storeLeancloud);

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
   * 初始化方法
   * @param  {Object} options []
   * @return {}         []
   */

  _default.prototype.init = function init(options) {
    this.options = think.parseConfig(think.config('cache'), options);

    this.name = this.options.name || 'ThinkCache';
    this.timeout = this.options.timeout || 0;
    this.prefix = this.options.prefix || '';

    this.store = new _storeLeancloud2['default'](think.extend({
      name: this.name
    }, think.config('leancloud')));

    this.gcType = "cache_leancloud";
    think.gc(this);
  };

  /**
   * 获取缓存
   * @param  {String} name []
   * @return {Promise}      []
   */

  _default.prototype.get = function get(name) {
    var data;
    return _regeneratorRuntime.async(function get$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.store.get(this.prefix + name));

        case 2:
          data = context$2$0.sent;

          if (data) {
            context$2$0.next = 5;
            break;
          }

          return context$2$0.abrupt('return');

        case 5:

          data = JSON.parse(data);

          if (!(data.expire && Date.now() > data.expire)) {
            context$2$0.next = 12;
            break;
          }

          context$2$0.next = 9;
          return _regeneratorRuntime.awrap(this.store['delete'](this.prefix + name));

        case 9:
          return context$2$0.abrupt('return', context$2$0.sent);

        case 12:
          return context$2$0.abrupt('return', data.data);

        case 13:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  /**
   * 设置缓存
   * @param {String} name    []
   * @param {Mixed} value   []
   * @param {Number} timeout []
   * @return {Promise}
   */

  _default.prototype.set = function set(name, value) {
    var timeout = arguments.length <= 2 || arguments[2] === undefined ? this.timeout : arguments[2];
    var key, data;
    return _regeneratorRuntime.async(function set$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (think.isObject(name)) {
            timeout = value || timeout;
            key = _Object$keys(name)[0];

            value = name[key];
            name = key;
          }
          data = {
            data: value,
            expire: Date.now() + timeout * 1000,
            timeout: timeout
          };
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap(this.store.set(this.prefix + name, JSON.stringify(data)));

        case 4:
          return context$2$0.abrupt('return', context$2$0.sent);

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  /**
   * 删除缓存
   * @param  {String} name []
   * @return {Promise}      []
   */

  _default.prototype['delete'] = function _delete(name) {
    return _regeneratorRuntime.async(function _delete$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.store['delete'](this.prefix + name));

        case 2:
          return context$2$0.abrupt('return', context$2$0.sent);

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  /**
   * 缓存垃圾回收
   * @return {Promise} []
   */

  _default.prototype.gc = function gc() {
    var now, data, key;
    return _regeneratorRuntime.async(function gc$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          now = Date.now();
          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(this.store.list());

        case 3:
          data = context$2$0.sent;
          context$2$0.t0 = _regeneratorRuntime.keys(data);

        case 5:
          if ((context$2$0.t1 = context$2$0.t0()).done) {
            context$2$0.next = 11;
            break;
          }

          key = context$2$0.t1.value;
          context$2$0.next = 9;
          return _regeneratorRuntime.awrap(this.get(key.slice(this.prefix.length)));

        case 9:
          context$2$0.next = 5;
          break;

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  return _default;
})(think.adapter.base);

exports['default'] = _default;
module.exports = exports['default'];