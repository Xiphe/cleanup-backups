'use strict';

var fs = require('fs');
var now = require('./now');

module.exports = function(file, cb) {
  fs.stat(file, function(err, stat) {
    if (err) {
      return cb(err);
    }
    cb(null, now - Date.parse(stat.mtime));
  });
};
