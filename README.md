cleanup-backups
---------------

remove files based on age, keeping some for given time ranges


Programmatic Usage
------------------

### install

`npm install --save`


### require

`var cleanupBackups = require('cleanup-backups');`


### invoke

`cleanupBackups(opts[, callback(err, deletedFiles)])`

Deletes files based on opts and calls optional node-style
callback with error or the deleted files

returns [Q](https://github.com/kriskowal/q/tree/v1) promise


### Options

#### `baseFolder`

__required__

the base folder of the operation

#### `rules`

__required__

Array of rules

Each rule is an integer specifying the
interval in which one file should be keeped
before the next rule applies

#### `glob`

_optional_

[node-glob](https://github.com/isaacs/node-glob) compatible
glob for finding the files to work with in [`baseFolder`](#baseFolder)

Default: `*`

#### `dry`

_optional_

do not actually delete the files, just pass them to callback
and promise

Default: `false`

#### `getAge`

_optional_

function that determines the age of a given file

Default (using mtime):
```js
var now = new Date().getTime();
function getAge(file, cb) {
  fs.stat(file, function(err, stat) {
    if (err) {
      return cb(err);
    }
    cb(null, now - Date.parse(stat.mtime));
  });
}
```

### Example Usage

```js
var path = require('path');
require('cleanup-backups')({
  baseFolder: '/backups',
  glob: '*.bak',
  rules: [
    // keep one backup every hour
    1000 * 60 * 60, 
    // for the past 6 hours, then keep one every 6 hours
    1000 * 60 * 60 * 6,
    // for the first day, then keep one backup a day
    1000 * 60 * 60 * 24,
    // for this week, then keep one a week
    1000 * 60 * 60 * 24 * 7,
    // for the current month, then keep one file a month
    1000 * 60 * 60 * 24 * 30,
    // for one year, then keep one backup per year, forever
    1000 * 60 * 60 * 24 * 365
  ],
  dry: false,
  getAge: function(file, cb) {
    // for example when the file name is the file creation time stamp
    cb(path.basename(file, '.bak'));
  }
}).then(function(files) {
  files.forEach(function(file) {
    console.log('deleted', file.path, 'with age', file.age);
  });
});
```

Assuming there where backups created every 30 minutes, this would lead to:
  
  - [1h ago].bak
  - [2h ago].bak
  - {... hourly ...}
  - [6h ago].bak
  - [12h ago].bak
  - [18h ago].bak
  - [24h ago].bak
  - [1day ago].bak
  - [2days ago].bak
  - {... daily ...}
  - [7days ago].bak
  - [2weeks ago].bak
  - [3weeks ago].bak
  - [4weeks ago].bak
  - [2months ago].bak
  - {... monthly ...}
  - [12months ago].bak
  - [2jears ago].bak
  - [3jears ago].bak
  - { and so on and so forth ... }


LICENSE
-------

> The MIT License
> 
> Copyright (c) 2015 Hannes Diercks
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
