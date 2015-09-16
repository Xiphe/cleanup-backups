var fs = require('fs');
var Q = require('q');

module.exports = function(files, dry) {
  'use strict';

  var queue = [];

  files.forEach(function(file) {
    if (file.obsolete) {
      delete file.obsolete;
      if (dry) {
        queue.push(file);
      } else {
        queue.push(Q.nfcall(fs.unlink, file.path)
          .then(function() {
            return file;
          }));
      }
    }
  });

  return Q.all(queue);
};
