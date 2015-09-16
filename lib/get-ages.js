'use strict';

var Q = require('q');
var path = require('path');

module.exports = function getAges(files, baseFolder, getAge) {
  var queue = [];

  files.forEach(function(file) {
    var filePath = path.join(baseFolder, file);
    queue.push(Q.nfcall(
      getAge,
      filePath
    ).then(function(age) {
      return {
        path: filePath,
        age: age
      };
    }));
  });

  return Q.all(queue);
};
