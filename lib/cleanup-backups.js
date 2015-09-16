'use strict';

var CONST = require('./constants');
var _ = require('lodash');
var glob = require('glob');
var Q = require('q');
var markObsolete = require('./mark-obsolete');
var getAges = require('./get-ages');
var deleteObsolete = require('./delete-obsolete');

function validate(opts) {
  if (!opts.baseFolder) {
    throw new Error(CONST.ERR.MISSING_BASE_FOLDER);
  }
  if (!opts.rules) {
    throw new Error(CONST.ERR.MISSING_RULES);
  }
  return opts;
}

function extendDefaults(opts) {
  return _.merge({}, CONST.DEFAULTS, opts);
}

module.exports = function cleanupBackup(opts) {
  return Q.fcall(validate, opts)
    .then(extendDefaults)
    .then(function(mergedOpts) {
      return Q.nfcall(glob, mergedOpts.glob, {cwd: mergedOpts.baseFolder})
        .then(function(files) {
          return getAges(files, mergedOpts.baseFolder, mergedOpts.getAge);
        })
        .then(function(filesWithAge) {
          return markObsolete(filesWithAge, mergedOpts.rules);
        })
        .then(deleteObsolete);
    });
};
