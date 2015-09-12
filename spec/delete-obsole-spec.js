describe('delete-obsolete', function() {
  'use strict';

  var proxyquire = require('proxyquire');
  var fakeFs = {
    unlink: function() {}
  };
  var deleteObsolete = proxyquire('../lib/delete-obsolete', {
    fs: fakeFs
  });

  it('should delete obsolete files', function(done) {
    spyOn(fakeFs, 'unlink').and.callFake(function(file, cb) {
      cb();
    });

    deleteObsolete([{file: 'foo/a'}, {file: 'bar/b', obsolete: true}])
      .then(function() {
        expect(fakeFs.unlink.calls.count()).toEqual(1);
        expect(fakeFs.unlink.calls.argsFor(0)[0]).toBe('bar/b');
        done();
      }).catch(done.fail);
  });
});
