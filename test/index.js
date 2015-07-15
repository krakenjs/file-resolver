'use strict';

var fileResolver = require('../index'),
    test = require('tap').test,
    path = require('path');

var bcp47 = require('bcp47');

test('fileResolver', function (t) {
    t.test('Creating a file resolver without options should throw assertion error', function (t) {
        var resolvr;

        try {
            resolvr = fileResolver.create();
        } catch(e){
            t.equal('root is not defined. A root directory must be specified.', e.message);
        }
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', ext: 'dust', formatPath: legacyFormatPath });
        t.deepEqual(resolvr.fallbackLocale, bcp47.parse('en-US'));
        t.equal(typeof resolvr.locate, 'function');
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', ext: '.dust', formatPath: legacyFormatPath });
        t.deepEqual(resolvr.fallbackLocale, bcp47.parse('en-US'));
        t.equal(typeof resolvr.locate, 'function');
        t.end();
    });


    t.test('resolving for an extension with default locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', ext: 'dust', formatPath: legacyFormatPath });
        var info = resolvr.resolve('test');

        t.equal(info.root, __dirname + path.normalize('/fixtures/root/US/en/'));
        t.equal(info.file, __dirname + path.normalize('/fixtures/root/US/en/test.dust'));
        t.equal(info.ext, 'dust');
        t.equal(info.name, 'test');
        t.end();
    });

    t.test('resolving for an extension with a specified locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', ext: 'dust', formatPath: legacyFormatPath });
        var info = resolvr.resolve('test', 'es_US');

        t.equal(info.root, __dirname + path.normalize('/fixtures/root/US/es/'));
        t.equal(info.file, __dirname + path.normalize('/fixtures/root/US/es/test.dust'));
        t.equal(info.ext, 'dust');
        t.equal(info.name, 'test');
        t.end();
    });

    t.test('Resolve a bundle not in the primary langauge but is in the fallback', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', ext: 'dust', formatPath: legacyFormatPath });
        var info = resolvr.resolve('fallback', 'es_US');

        t.equal(info.root, __dirname + path.normalize('/fixtures/root/US/en/'));
        t.equal(info.file, __dirname + path.normalize('/fixtures/root/US/en/fallback.dust'));
        t.equal(info.ext, 'dust');
        t.equal(info.name, 'fallback');
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), ext: 'dust', formatPath: legacyFormatPath });
        t.equal(resolvr.fallbackLocale, null);
        t.equal(typeof resolvr.locate, 'function');
        t.end();
    });

    t.test('resolving for an extension without locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), ext: 'dust', formatPath: legacyFormatPath });
        var info = resolvr.resolve('test');

        t.equal(info.root, __dirname + path.normalize('/fixtures/root/'));
        t.equal(info.file, __dirname + path.normalize('/fixtures/root/test.dust'));
        t.equal(info.ext, 'dust');
        t.equal(info.name, 'test');
        t.end();
    });

    t.test('trying to resolve with a locale object', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), ext: 'dust', formatPath: legacyFormatPath });
        var info = resolvr.resolve('test', 'es-US');
        t.equal(info.root, __dirname + path.normalize('/fixtures/root/US/es/'));
        t.equal(info.file, __dirname + path.normalize('/fixtures/root/US/es/test.dust'));
        t.equal(info.ext, 'dust');
        t.equal(info.name, 'test');
        t.end();
    });

    t.test('Creating a file resolver with invalid root', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures'), ext: 'dust', formatPath: legacyFormatPath });
        t.deepEqual(resolvr.fallbackLocale, null);
        t.equal(typeof resolvr.locate, 'function');
        var info = resolvr.resolve('test');
        t.equal(info.root, undefined);
        t.equal(info.file, undefined);
        t.equal(info.ext, 'dust');
        t.equal(info.name, 'test');
        t.end();
    });

    t.test('Creating a file resolver with invalid locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), ext: 'dust', fallback: 'es', formatPath: legacyFormatPath });
        t.deepEqual(resolvr.fallbackLocale, bcp47.parse('es'));
        t.equal(typeof resolvr.locate, 'function');
        t.end();
    });
});

function legacyFormatPath(locale) {
    if (locale) {
        return path.join(locale.langtag.region, locale.langtag.language.language);
    } else {
        return '';
    }
}
