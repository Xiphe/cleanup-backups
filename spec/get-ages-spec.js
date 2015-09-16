describe('get-ages', function() {
  'use strict';

  var proxyquire = require('proxyquire');
  var fakeFs = {
    stat: function() {}
  };
  var now = new Date().getTime();
  var getAge = proxyquire('../lib/get-age', {
    fs: fakeFs,
    './now': now
  });
  var getAges = require('../lib/get-ages');

  it('should return a promise resolving to files with ages', function(done) {
    var date = 'Aug 1, 1986';
    var age = now - Date.parse(date);
    spyOn(fakeFs, 'stat').and.callFake(function(file, cb) {
      cb(null, {mtime: date});
    });
    getAges(['a', 'b'], 'foo', getAge).then(function(filesWithAges) {
      expect(filesWithAges).toEqual([{
        file: 'foo/a',
        age: age
      }, {
        file: 'foo/b',
        age: age
      }]);
      done();
    }, done.fail);
  });
});
