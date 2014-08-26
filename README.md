file-resolver [![Build Status](https://travis-ci.org/paypal/kraken-js.png)](https://travis-ci.org/krakenjs/file-resolver)
============

Used in kraken based projects for resolving file paths when given the locale, source file name, and the file extension.

Simple Usage:

```javascript
var fr = require('fileResolver'),
    resolver = fr.create({root: 'path/to/templates', fallback: 'en_US', ext: 'dust'}),
    fileInfo = resolver.resolve('foo', 'es_ES');

//fileInfo = {
//  root: 'path/to/templates/ES/es',
//  file: 'path/to/templates/ES/es/foo.dust',
//  ext: 'dust',
//  name: 'foo'
//}
```

Running Tests:

```
To Run tests
$npm test

To Run Coverage
$npm run-script cover

To Run linting
$npm run-script lint
```



New Stuff
=========

The setup
---------

* root `/foo/bar/baz`
* regionSearchPath `{ US: "GLOBAL", DE: "EMEA", EMEA: "GLOBAL" }`
* fallback `en_US`

Called with
-----------

* locale `en_US`
* file `quux/test`
* ext `dust`

yields:

```
/foo/bar/baz/US/en/quux/test.dust
/foo/bar/baz/US/en/test.dust
/foo/bar/baz/GLOBAL/en/quux/test.dust # Specific region fails, fall back
/foo/bar/baz/GLOBAL/en/test.dust
```

locale `de_DE` yields:
---------------------

```
/foo/bar/baz/DE/de/quux/test.dust
/foo/bar/baz/DE/de/test.dust
/foo/bar/baz/EMEA/de/quux/test.dust # Specific region fails, fall back
/foo/bar/baz/EMEA/de/test.dust
/foo/bar/baz/GLOBAL/de/quux/test.dust # Next region fails, fall back
/foo/bar/baz/GLOBAL/de/test.dust
/foo/bar/baz/DE/en/quux/test.dust # Language has failed entirely, fall back [1]
/foo/bar/baz/DE/en/test.dust
/foo/bar/baz/EMEA/en/quux/test.dust # Language and specific region has failed, fall back
/foo/bar/baz/EMEA/en/test.dust
/foo/bar/baz/GLOBAL/en/quux/test.dust # Language and next region failed, fall back
/foo/bar/baz/GLOBAL/en/test.dust
/foo/bar/baz/US/en/quux/test.dust # Language and specified region failed, try the hard-coded fallback [2]
/foo/bar/baz/US/en/test.dust
/foo/bar/baz/GLOBAL/en/quux/test.dust # Even that failed. Fall back. [3]
/foo/bar/baz/GLOBAL/en/test.dust
```

At [1], this is new behavior -- choosing a new language but retaining the old region. I could see an argument for not doing this and falling back faster, skipping to [2].

[2] Could skip to here.

At [3], we're duplicating -- I could see an argument for re-arranging this to not duplicate in the search, though it'll be in the OS's cache.

Porting from file-resolver 0.0.1
================================

File layout has changed: language and region have been reversed. Instead of `US/en`, it's `en/US`.

The API is now asynchronous: `result = resolver.resolve(...)` is now `resolver.resolve(..., function (err, file) { ... })`.

The API now only returns the file resolved, no other information about it.
