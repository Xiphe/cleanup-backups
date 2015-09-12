'use strict';

var Q = require('q');
var fs = require('fs');
var path = require('path');
var now = require('./now');

module.exports = function getAges(files, baseFolder) {
  var queue = [];

  files.forEach(function(file) {
    var filePath = path.join(baseFolder, file);
    queue.push(Q.nfcall(
      fs.stat,
      filePath
    ).then(function(stat) {
      return {
        file: filePath,
        age: now - Date.parse(stat.mtime)
      };
    }));
  });

  return Q.all(queue);
};
