'use strict';

var fileResolver = require('../index'),
    test = require('tape');

test('fileResolver', function (t) {
    var resolvr;

    t.test('Creating a file resolver without options should throw assertion error', function (t) {
        try {
            resolvr = fileResolver.create();
        } catch (e) {
            t.equal('root is not defined. A root directory must be specified.', e.message);
        }
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', ext: 'dust'});
        t.deepEqual(resolvr.fallback, { country: 'US', language: 'en' });
        t.end();
    });

    t.test('Creating a file resolver with options', function (t) {
        resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', ext: '.dust'});
        t.deepEqual(resolvr.fallback, { country: 'US', language: 'en' });
        t.end();
    });


    t.test('resolving for an extension with default locale', function (t) {
        resolvr = fileResolver.create({root: __dirname + '/fixtures/root', fallback: 'en_US', ext: 'dust'});
        resolvr.resolve('test', function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/US/en/test.dust');
            t.end();
        });
    });

    t.test('resolving for an extension with a specified locale', function (t) {
        resolvr.resolve('test', 'es_US', function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/US/es/test.dust');
            t.end();
        });

    });

    t.test('Creating a file resolver with options', function (t) {
        resolvr = fileResolver.create({root: __dirname + '/fixtures/root', ext: 'dust'});
        t.deepEqual(resolvr.fallback, { country: '', language: '' });
        t.end();
    });

    t.test('resolving for an extension without locale', function (t) {
        resolvr.resolve('test', function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/test.dust');
            t.end();
        });
    });

    t.test('trying to resolve with a locale object', function (t) {
        resolvr.resolve('test', { country: 'US', language: 'es' }, function (err, file) {
            t.equal(file, __dirname + '/fixtures/root/US/es/test.dust');
            t.end();
        });
    });

    t.test('Creating a file resolver with invalid root', function (t) {
        resolvr = fileResolver.create({root: __dirname + '/fixtures', ext: 'dust'});
        t.deepEqual(resolvr.fallback, { country: '', language: '' });

        resolvr.resolve('test', function (err, file) {
            t.equal(file, undefined);
            t.end();
        });
    });

    t.test('Creating a file resolver with invalid locale', function (t) {
        resolvr = fileResolver.create({root: __dirname + '/fixtures/root', ext: 'dust', fallback: 'es'});
        t.deepEqual(resolvr.fallback, { country: '', language: 'es' });
        t.end();
    });
});
