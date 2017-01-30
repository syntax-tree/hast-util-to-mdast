'use strict';

exports.root = require('./root');

exports.text = require('./text');

exports.strong = exports.b = require('./strong');
exports.em = exports.i = require('./emphasis');
exports.code = exports.kbd = exports.samp = exports.var = require('./inline-code');
exports.img = require('./image');

exports.p = require('./paragraph');
exports.pre = require('./code');

exports.h1 = exports.h2 = exports.h3 =
  exports.h4 = exports.h5 = exports.h6 = require('./heading');

exports.a = require('./link');
