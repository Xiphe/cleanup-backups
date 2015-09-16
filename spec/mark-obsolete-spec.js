describe('mark-obsolete', function() {
  'use strict';

  var markObsolete = require('../lib/mark-obsolete');
  var cleanupBackups = require('../lib/index.js');

  it('should mark objects when to many in range', function() {
    var files = [
      {age: 0},
      {age: 50},
      {age: 700}
    ];
    var rules = [{
      age: 1000,
      keep: 2
    }];
    markObsolete(files, rules);
    expect(files[0].obsolete).toBe(true);
    expect(files[1].obsolete).toBeUndefined();
    expect(files[2].obsolete).toBeUndefined();
  });

  it('should allow -1 to keep all', function() {
    var files = [
      {age: 0},
      {age: 50},
      {age: 700}
    ];
    var rules = [{
      age: 1000,
      keep: -1
    }];
    markObsolete(files, rules);
    expect(files[0].obsolete).toBeUndefined();
    expect(files[1].obsolete).toBeUndefined();
    expect(files[2].obsolete).toBeUndefined();
  });

  it('should not mark objects out of rule bounds', function() {
    var files = [
      {age: 0},
      {age: 50},
      {age: 700}
    ];
    var rules = [{
      age: 100,
      keep: 2
    }];
    markObsolete(files, rules);
    expect(files[0].obsolete).toBeUndefined();
  });

  it('should not mark objects handled by previous rules', function() {
    var files = [
      {age: 0},
      {age: 20},
      {age: 50},
      {age: 100},
      {age: 700},
      {age: 1000},
      {age: 1001}
    ];
    var rules = [{
      age: 100,
      keep: 2
    }, {
      age: 1000,
      keep: 1
    }];
    markObsolete(files, rules);
    expect(files[0].obsolete).toBe(true);
    expect(files[1].obsolete).toBe(true);
    expect(files[2].obsolete).toBeUndefined();
    expect(files[3].obsolete).toBeUndefined();
    expect(files[4].obsolete).toBe(true);
    expect(files[5].obsolete).toBeUndefined();
    expect(files[6].obsolete).toBeUndefined();
  });

  it('should throw when a range is smaller than the previous', function() {
    var files = [
      {age: 0},
      {age: 50},
      {age: 700}
    ];
    var rules = [{
      age: 100,
      keep: 2
    }, {
      age: 40,
      keep: 0
    }];

    expect(function() {
      markObsolete(files, rules);
    }).toThrow(new Error(cleanupBackups.CONST.ERR.AGE_DID_NOT_INCREASE));
  });
});
