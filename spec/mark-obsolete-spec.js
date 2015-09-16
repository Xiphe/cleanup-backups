describe('mark-obsolete', function() {
  'use strict';

  var markObsolete = require('../lib/mark-obsolete');
  var constants = require('../lib/constants');

  it('should throw if a rule is 0', function() {
    var files = [{age: 5}];
    var rules = [0];
    expect(function() {
      markObsolete(files, rules);
    }).toThrow(new Error(constants.ERR.ZERO_IS_NOT_A_VALID_RULE));
  });

  it('should mark files obsolete that do not match interval', function() {
    var files = [];
    for (var i = 0; i < 12; i += 1) {
      files.push({age: i});
    }
    var rules = [5];
    markObsolete(files, rules);
    expect(files[0].obsolete).toBeUndefined();
    expect(files[1].obsolete).toBe(true);
    expect(files[2].obsolete).toBe(true);
    expect(files[3].obsolete).toBe(true);
    expect(files[4].obsolete).toBe(true);
    expect(files[5].obsolete).toBeUndefined();
    expect(files[6].obsolete).toBe(true);
    expect(files[9].obsolete).toBe(true);
    expect(files[10].obsolete).toBeUndefined();
    expect(files[11].obsolete).toBe(true);
  });

  it('should work with multiple intervals', function() {
    var files = [];
    for (var i = 0; i < 12; i += 1) {
      files.push({age: i});
    }
    var rules = [2, 5];
    markObsolete(files, rules);
    expect(files[0].obsolete).toBeUndefined();
    expect(files[1].obsolete).toBe(true);
    expect(files[2].obsolete).toBeUndefined(true);
    expect(files[3].obsolete).toBe(true);
    expect(files[4].obsolete).toBeUndefined();
    expect(files[5].obsolete).toBeUndefined();
    expect(files[6].obsolete).toBe(true);
    expect(files[9].obsolete).toBe(true);
    expect(files[10].obsolete).toBeUndefined();
    expect(files[11].obsolete).toBe(true);
  });

  it('should work with complex intervals', function() {
    var files = [];
    for (var i = 0; i < 2600; i += 1) {
      files.push({age: i});
    }
    var rules = [
      2, // fake hour
      2 * 5, // fake day
      2 * 5 * 7, // fake week
      2 * 5 * 3, // fake month-ish
      2 * 5 * 65 // fake year
    ];
    markObsolete(files, rules);
    var filteredFiles = files.filter(function(file) {
      return !file.obsolete;
    });
    expect(filteredFiles.length).toBe(21);
  });
});
