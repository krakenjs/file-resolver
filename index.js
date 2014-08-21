/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                                │
 │                                                                             │
 │hh ,'""`.                                                                    │
 │  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
 │  |(@)(@)|  you may not use this file except in compliance with the License. │
 │  )  __  (  You may obtain a copy of the License at                          │
 │ /,'))((`.\                                                                  │
 │(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
 │ `\ `)(' /'                                                                  │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
'use strict';

var path = require('path'),
    util = require('./lib/util'),
    assert = require('assert');


function Resolver(root, fallback, ext) {
    this.root = root;
    this.fallback = util.parseLangTag(fallback);
    this.ext = ext;
}

function locate(name, locale, cb) {
    /*jshint validthis: true*/
    var relative = path.join(this.root, locale.country || '', locale.language || '');
    var val = util.locate(name, this.root, relative);
    if (val) {
        cb(null, val);
    } else {
        cb(null, util.locate(name, this.root, this.root));
    }
}

/**
 * Finds a file that matches the provided name, falling back to a root directory.
 */
Resolver.prototype.resolve = function (name, locale, callback) {
    if (!callback) {
        callback = locale;
        locale = null;
    }

    if (!locale) {
        locale = this.fallback;
    }

    name = name + this.ext;
    locate.call(this, name, util.parseLangTag(locale), callback);
};

exports.create = function (options) {
    var ext;
    options = options || {};
    assert(options.root, 'root is not defined. A root directory must be specified.');
    assert(options.ext, 'ext is not defined. A file extension is required.');

    ext = options.ext;
    if (ext[0] !== '.') {
        ext = '.' + ext;
    }

    return new Resolver(options.root, util.parseLangTag(options.fallback), ext);
};
