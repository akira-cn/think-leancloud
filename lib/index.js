'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _adapterStoreLeancloud = require('./adapter/store/leancloud');

var _adapterStoreLeancloud2 = _interopRequireDefault(_adapterStoreLeancloud);

var _adapterCacheLeancloud = require('./adapter/cache/leancloud');

var _adapterCacheLeancloud2 = _interopRequireDefault(_adapterCacheLeancloud);

var _adapterCacheLeancloud3 = _interopRequireDefault(_adapterCacheLeancloud);

exports['default'] = {
  Store: _adapterStoreLeancloud2['default'],
  Cache: _adapterCacheLeancloud2['default'],
  Session: _adapterCacheLeancloud3['default']
};
module.exports = exports['default'];