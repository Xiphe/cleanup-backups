'use strict';

var CONST = require('./constants');

module.exports = function(input, rules) {
  var listLen = input.length;
  var lastRange = -1;

  input.sort(function(a, b) {
    if (a.age === b.age) {
      return 0;
    } else if (a.age > b.age) {
      return -1;
    } else {
      return 1;
    }
  });

  rules.forEach(function(rule) {
    if (rule.range <= lastRange) {
      throw new Error(CONST.ERR.RANGE_DID_NOT_INCREASE);
    }

    var i = 0;

    if (listLen > rule.keep - 1 && rule.keep >= 0) {
      input.forEach(function(entry) {
        if (entry.age > rule.range ||
          entry.age <= lastRange
        ) {
          return;
        }

        if (i > rule.keep - 1) {
          entry.obsolete = true;
        }

        i += 1;
      });
    }

    lastRange = rule.range;
  });

  return input.reverse();
};
