'use strict';

var CONST = require('./constants');

module.exports = function(input, rules) {
  var listLen = input.length;
  var lastAge = -1;

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
    if (rule.age <= lastAge) {
      throw new Error(CONST.ERR.AGE_DID_NOT_INCREASE);
    }

    var i = 0;

    if (listLen > rule.keep - 1 && rule.keep >= 0) {
      input.forEach(function(entry) {
        if (entry.age > rule.age ||
          entry.age <= lastAge
        ) {
          return;
        }

        if (i > rule.keep - 1) {
          entry.obsolete = true;
        }

        i += 1;
      });
    }

    lastAge = rule.age;
  });

  return input.reverse();
};
