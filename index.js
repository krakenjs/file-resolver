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


function Resolver(root, fallback, searchPaths, ext) {
    this.root = root;
    this.fallback = util.parseLangTag(fallback);
    this.searchPaths = searchPaths;
    this.ext = ext;
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

    var loc = util.parseLangTag(locale);

    var ext = this.ext;
    var root = this.root;
    var searchPaths = this.searchPaths;

    function resolve(country, language) {
        var relative = path.join(root, country || '', language || '');
        var val = util.locate(name + ext, root, relative);

        if (val) {
            return callback(null, val);
        } else if (searchPaths[country]) {
            return resolve(searchPaths[country], language);
        } else {
            return callback(new Error("Not found"));
        }
    }

    return resolve(loc.country, loc.language);

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

    return new Resolver(options.root, util.parseLangTag(options.fallback), options.searchMap || {}, ext);
};
