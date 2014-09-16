'use strict';

var fileResolver = require('../index'),
    test = require('tape');

test('fileResolver', function (t) {
    t.test('Creating a file resolver without options should throw assertion error', function (t) {
        var resolvr;

        try {
            resolvr = fileResolver.create();
        } catch (e) {
            t.equal('root is not defined. A root directory must be specified.', e.message);
        }
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', ext: 'dust'});
        t.deepEqual(resolvr.fallback, { country: 'US', language: 'en' });
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', ext: '.dust'});
        t.deepEqual(resolvr.fallback, { country: 'US', language: 'en' });
        t.end();
    });


    t.test('resolving for an extension with default locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', ext: 'dust'});
        resolvr.resolve('test', function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/en/US/test.dust');
            t.end();
        });
    });

    t.test('resolving for an extension with a specified locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', ext: 'dust'});
        resolvr.resolve('test', 'es_US', function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/es/US/test.dust');
            t.end();
        });
    });

    t.test('Creating a file resolver with options', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', ext: 'dust'});
        t.deepEqual(resolvr.fallback, { country: '', language: '' });
        t.end();
    });

    t.test('resolving for an extension without locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', ext: 'dust'});
        resolvr.resolve('test', function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/test.dust');
            t.end();
        });
    });

    t.test('trying to resolve with a locale object', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', ext: 'dust'});
        resolvr.resolve('test', { country: 'US', language: 'es' }, function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/es/US/test.dust');
            t.end();
        });
    });

    t.test('Creating a file resolver with invalid root', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures', ext: 'dust'});
        t.deepEqual(resolvr.fallback, { country: '', language: '' });

        resolvr.resolve('test', function (err, file) {
            t.equal(file, undefined);
            t.end();
        });
    });

    t.test('Creating a file resolver with invalid locale', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', ext: 'dust', fallback: 'es'});
        t.deepEqual(resolvr.fallback, { country: '', language: 'es' });
        t.end();
    });

    t.test('resolving for an extension with a specified locale that searches deeper', function (t) {
        var resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', searchMap: {
            "XX": "US"
        }, ext: 'dust'});
        resolvr.resolve('test', 'en_XX', function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/en/US/test.dust');
            t.end();
        });
    });
});
