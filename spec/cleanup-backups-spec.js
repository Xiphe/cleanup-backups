describe('cleanup-backups', function() {
  'use strict';

  var path = require('path');
  var proxyquire = require('proxyquire');
  var age = 0;
  var fakeFs = {
    unlink: function(file, cb) {
      cb();
    }
  };
  var deleteObsolete = proxyquire('../lib/delete-obsolete', {
    fs: fakeFs
  });
  var constants = proxyquire('../lib/constants', {
    './get-age': function(file, cb) {
      cb(null, age);
      age += 1;
    }
  });
  var cleanupBackups = proxyquire('../lib/cleanup-backups', {
    './constants': constants,
    './delete-obsolete': deleteObsolete
  });

  beforeEach(function() {
    age = 0;
  });

  it('should throw if no basefolder is given', function(done) {
    cleanupBackups({
      rules: []
    }).then(done.fail, function(err) {
      expect(err.message).toBe(cleanupBackups.CONST.ERR.MISSING_BASE_FOLDER);
      done();
    });
  });

  it('should throw if not rules given', function(done) {
    cleanupBackups({
      baseFolder: path.join(__dirname, 'backups')
    }).then(done.fail, function(err) {
      expect(err.message).toBe(cleanupBackups.CONST.ERR.MISSING_RULES);
      done();
    });
  });

  it('should invoke optional callback with error', function(done) {
    cleanupBackups({
      baseFolder: path.join(__dirname, 'backups')
    }, function(err) {
      expect(err.message).toBe(cleanupBackups.CONST.ERR.MISSING_RULES);
      done();
    });
  });

  it('should work', function(done) {
    spyOn(fakeFs, 'unlink').and.callThrough();
    cleanupBackups({
      rules: [{age: 0, keep: -1}, {age: 2, keep: 1}],
      baseFolder: path.join(__dirname, 'backups')
    }).then(function() {
      expect(fakeFs.unlink.calls.count()).toBe(1);
      expect(fakeFs.unlink.calls.argsFor(0)[0]).toBe(path.join(
        __dirname,
        'backups/b'
      ));
      done();
    }).catch(done.fail);
  });

  it('should call optional callback with deleted files', function(done) {
    cleanupBackups({
      rules: [{age: 0, keep: -1}, {age: 2, keep: 1}],
      baseFolder: path.join(__dirname, 'backups')
    }, function(err, deletedFiles) {
      expect(err).toBe(null);
      expect(deletedFiles.length).toBe(1);
      expect(deletedFiles[0]).toEqual({
        path: path.join(__dirname, 'backups/b'),
        age: 1,
        obsolete: true
      });
      done();
    });
  });
});
