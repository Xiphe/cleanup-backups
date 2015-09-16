'use strict';

var CONST = require('./constants');

module.exports = function(input, rules) {
  var previousRule;

  input.sort(function(a, b) {
    if (a.age === b.age) {
      return 0;
    } else if (a.age > b.age) {
      return 1;
    } else {
      return -1;
    }
  });

  rules.sort(function(a, b) {
    if (a === b) {
      return 0;
    } else if (a > b) {
      return 1;
    } else {
      return -1;
    }
  });

  rules.forEach(function(rule, i) {
    if (rule === 0) {
      throw new Error(CONST.ERR.ZERO_IS_NOT_A_VALID_RULE);
    }

    var nextRule = rules[i + 1];
    var found = false;
    var baseRule = rule;

    input.forEach(function(entry) {
      if (nextRule && entry.age >= nextRule ||
        previousRule && entry.age < baseRule
      ) {
        return;
      }

      if (entry.age < rule) {
        if (found) {
          entry.obsolete = true;
        } else {
          found = true;
        }
      } else {
        while (entry.age >= rule) {
          rule = rule + baseRule;
        }
        found = true;
      }
    });

    previousRule = baseRule;
  });

  return input;
};
