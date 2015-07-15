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


var proto = {

    get fallbackLocale() {
        return this.fallback;
    },

    locate: function (name, locale) {
        var relative = path.join(this.root, locale.country, locale.language);
        var val = util.locate(name, this.root, relative);

        if (!val.file) {
            relative = path.join(this.root, this.fallback.country, this.fallback.language);
            val = util.locate(name, this.root, relative);
        }

        return val;
    },

    /**
     * Finds a file that matches the provided name, falling back to a root directory.
     * @param name
     * @param locale
     * @returns {*}
     */
    resolve: function (name, locale) {
        var match, loc;
        name = name + this.ext;
        loc = locale ? util.parseLangTag(locale) : this.fallback;
        match = this.locate(name, loc);
        return match;
    }

};

function Resolver(options) {
    options = options || {};
    assert(options.root, 'root is not defined. A root directory must be specified.');
    assert(options.ext, 'ext is not defined. A file extension is required.');

    if (options.ext[0] !== '.') {
        this.ext = '.' + options.ext;
    } else {
        this.ext = options.ext;
    }

    this.root = options.root;
    this.fallback = util.parseLangTag(options.fallback);
}

Resolver.prototype = proto;

exports.create = function (options) {
    return new Resolver(options);
};
