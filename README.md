fileResolver [![Build Status](https://travis-ci.org/paypal/kraken-js.png)](https://travis-ci.org/pvenkatakrishnan/fileResolver)
============

Used in kraken based projects for resolving files given the locale ,source file name, and the file extension.

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