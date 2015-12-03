'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

exports.__esModule = true;
var AV = require('avoscloud-sdk');

/**
 * leancloud store adapter
 */

var Storage = (function (_think$adapter$base) {
  _inherits(Storage, _think$adapter$base);

  function Storage() {
    _classCallCheck(this, Storage);

    _think$adapter$base.apply(this, arguments);
  }

  /**
    根据文档：
    AV.Object.extend 产生的对象需要作为全局变量保存，
    因为每调用 一次，就会产生一个新的类的实例，
    并且和之前创建的实例形成一个链表。 
    如果你的应用时不时出现 Maximum call stack size exceeded 错误，
    请确认是否误用了该方法。     
   */

  Storage.getAVStorage = function getAVStorage(key) {
    var storages = thinkCache(thinkCache.COLLECTION, 'leancloud_avstore');
    storages = storages || {};
    if (!storages[key]) {
      storages[key] = AV.Object.extend(key);
      thinkCache(thinkCache.COLLECTION, 'leancloud_avstore', storages);
    }
    return storages[key];
  };

  /**
   * init
   * @return {[]}         []
   */

  Storage.prototype.init = function init(config) {
    var name = config.name;
    var appid = config.appid;
    var appkey = config.appkey;

    this.name = name || "ThinkStorage";
    AV.initialize(appid, appkey);
  };

  Storage.prototype.getInstance = function getInstance(key) {
    var AVStorage = Storage.getAVStorage(this.name);
    return new _Promise(function (resolve, reject) {
      var query = new AV.Query(AVStorage);
      query.equalTo('key', key);
      query.find({
        success: function success(results) {
          //console.log(results.length);
          var store = results[0];
          if (store == null) store = new AVStorage();
          resolve(store);
        },
        error: function error(_error) {
          resolve(new AVStorage());
        }
      });
    });
  };

  /**
   * get content
   * @param  {String} key []
   * @return {Promise}     []
   */

  Storage.prototype.get = function get(key) {
    var _this = this;

    return new _Promise(function callee$2$0(resolve, reject) {
      var store, value;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(this.getInstance(key));

          case 2:
            store = context$3$0.sent;
            value = store.get('value');

            resolve(value && value.data);

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  };

  /**
   * set key content
   * @param {} key     []
   * @param {} content []
   */

  Storage.prototype.set = function set(key, content) {
    var _this2 = this;

    return new _Promise(function callee$2$0(resolve, reject) {
      var store;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(this.getInstance(key));

          case 2:
            store = context$3$0.sent;

            store.set('key', key);
            store.set('value', { data: content });
            store.save({
              success: function success(item) {
                resolve();
              },
              error: function error(post, _error2) {
                throw new Error(_error2.message);
              }
            });

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
  };

  /**
   * delete key
   * @param  {String} key []
   * @return {}     []
   */

  Storage.prototype['delete'] = function _delete(key) {
    var store;
    return _regeneratorRuntime.async(function _delete$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.getInstance(key));

        case 2:
          store = context$2$0.sent;
          return context$2$0.abrupt('return', store.destroy());

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  /**
   * get all data
   * @return {} []
   */

  Storage.prototype.list = function list() {
    var AVStorage = Storage.getAVStorage(this.name);
    return new _Promise(function (resolve, reject) {
      var query = new AV.Query(AVStorage);
      query.find({
        success: function success(results) {
          //console.log(results.length);
          var data = {};
          results.forEach(function (store) {
            var key = store.get('key');
            var value = store.get('value');
            data[key] = value.data;
          });
          resolve(data);
        },
        error: function error(_error3) {
          resolve({});
        }
      });
    });
  };

  return Storage;
})(think.adapter.base);

exports['default'] = Storage;
module.exports = exports['default'];