'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _adapterStore = require('./adapter/store');

var _adapterStore2 = _interopRequireDefault(_adapterStore);

var _adapterCache = require('./adapter/cache');

var _adapterCache2 = _interopRequireDefault(_adapterCache);

var _adapterSession = require('./adapter/session');

var _adapterSession2 = _interopRequireDefault(_adapterSession);

exports['default'] = {
  Store: _adapterStore2['default'],
  Cache: _adapterCache2['default'],
  Session: _adapterSession2['default']
};
module.exports = exports['default'];