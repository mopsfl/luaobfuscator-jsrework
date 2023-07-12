/* global require,window */
(function() {
    'use strict';

    require.config({
        baseUrl: '../',
        paths: {
            'jasmine': 'bower_components/jasmine/lib/jasmine-core',
        },
        shim: {
            'jasmine/jasmine': {
                exports: 'window.jasmineRequire'
            },
            'jasmine/jasmine-html': {
                deps: ['jasmine/jasmine'],
                exports: 'window.jasmineRequire'
            },
            'jasmine/boot': {
                deps: ['jasmine/jasmine', 'jasmine/jasmine-html'],
                exports: 'window.jasmineRequire'
            },
            'jasmine-ajax': {
                deps: ['jasmine/jasmine', 'jasmine/boot'],
                exports: 'window.jasmineRequire'
            }
        }
    });

    require(
        [
            'jasmine/boot', 'test/string.spec'
        ],
        function() {
            window.onload();
        }
    );
})();
