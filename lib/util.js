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

var fs = require('graceful-fs'),
    path = require('path'),
    bcp47 = require('bcp47'),
    util = require('util'),
    assert = require('assert');

var debug = require('debuglog')('file-resolver');


/**
 * Converts a lang tag (en-US, en, fr-CA) into an object with properties `country` and `locale`
 * @param str String a language tag in the format `en-US`, `en_US`, `en`, etc.
 * @returns {{language: string, country: string}}
 */
exports.parseLangTag = function (str) {
    if (typeof str === 'object') {
        debug('language tag is already an object: %j', str);
        return str;
    } else if (!str) {
        return null;
    } else {
        return bcp47.parse(str.replace('_', '-'));
    }
};


/**
 * Walks up a directory tree to find a particular file, stopping at the specified root.
 * @param String name The name of the file to locate. May include parent directories (e.g. inc/foo.bar)
 * @param String start The starting directory
 * @returns string
 */
exports.locate = function locate(name, start) {
    start = path.normalize(start);

    var file = path.join(start, name);
    debug('trying to resolve %s %s %s', start, name, file);
    if (fs.existsSync(file)) {
        return file;
    } else {
        throw new Error("Not found");
    }

};
