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
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', formatPath: legacyFormatPath });
        t.deepEqual(resolvr.fallbackLocale, bcp47.parse('en-US'));
        t.equal(typeof resolvr.locate, 'function');
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', formatPath: legacyFormatPath });
        t.deepEqual(resolvr.fallbackLocale, bcp47.parse('en-US'));
        t.equal(typeof resolvr.locate, 'function');
        t.end();
    });


    t.test('resolving for an extension with default locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', formatPath: legacyFormatPath });
        resolvr.resolve('test.dust', null, function (err, file) {
            t.error(err);
            t.equal(file, __dirname + path.normalize('/fixtures/root/US/en/test.dust'));
            t.end();
        });
    });

    t.test('resolving for an extension with a specified locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', formatPath: legacyFormatPath });
        resolvr.resolve('test.dust', 'es_US', function (err, file) {
            t.error(err);
            t.equal(file, __dirname + path.normalize('/fixtures/root/US/es/test.dust'));
            t.end();
        });
    });

    t.test('Resolve a bundle not in the primary langauge but is in the fallback', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'en_US', formatPath: legacyFormatPath });
        resolvr.resolve('fallback.dust', 'es_US', function (err, file) {
            t.error(err);
            t.equal(file, __dirname + path.normalize('/fixtures/root/US/en/fallback.dust'));
            t.end();
        });
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), formatPath: legacyFormatPath });
        t.equal(resolvr.fallbackLocale, null);
        t.equal(typeof resolvr.locate, 'function');
        t.end();
    });

    t.test('resolving for an extension without locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), formatPath: legacyFormatPath });
        resolvr.resolve('test.dust', null, function (err, file) {
            t.error(err);
            t.equal(file, __dirname + path.normalize('/fixtures/root/test.dust'));
            t.end();
        });
    });

    t.test('trying to resolve with a locale object', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), formatPath: legacyFormatPath });
        resolvr.resolve('test.dust', 'es-US', function (err, file) {
            t.error(err);
            t.equal(file, __dirname + path.normalize('/fixtures/root/US/es/test.dust'));
            t.end();
        });
    });

    t.test('Creating a file resolver with invalid root', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures'), formatPath: legacyFormatPath });
        t.deepEqual(resolvr.fallbackLocale, null);
        t.equal(typeof resolvr.locate, 'function');
        resolvr.resolve('test.dust', null, function (err, file) {
            t.ok(err);
            t.notOk(file);
            t.end();
        });
    });

    t.test('Creating a file resolver with invalid locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + path.normalize('/fixtures/root'), fallback: 'es', formatPath: legacyFormatPath });
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
