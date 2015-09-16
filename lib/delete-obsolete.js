var fs = require('fs');
var Q = require('q');

module.exports = function(files) {
  'use strict';

  var queue = [];

  files.forEach(function(file) {
    if (file.obsolete) {
      queue.push(Q.nfcall(fs.unlink, file.path)
        .then(function() {
          delete file.obsolete;
          return file;
        }));
    }
  });

  return Q.all(queue);
};
