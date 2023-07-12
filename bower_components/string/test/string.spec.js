/* global define, describe, it, expect */
define(['jasmine/boot', 'string'], function() {
	'use strict';

	describe('String.js', function() {
        var spaced, hyphnd, cameld, uscord, mixed;

        beforeEach(function() {
            spaced = 'beware the jabberwock my son';
            hyphnd = 'beware-the-jabberwock-my-son';
            cameld = 'bewareTheJabberwockMySon';
            uscord = 'beware_the_jabberwock_my_son';
            mixed  = 'beware the-jabberwock_mySon';
        });

        it('capitalises the first letters of words', function() {
            expect(spaced.capitalise()).toEqual('Beware The Jabberwock My Son');
        });
        it('converts to underscores', function() {
            expect(spaced.underscore()).toEqual(uscord);
            expect(hyphnd.underscore()).toEqual(uscord);
            expect(cameld.underscore()).toEqual(uscord);
            expect(mixed.underscore()).toEqual(uscord);
        });
        it('removes underscores', function() {
            expect(uscord.deUnderscore()).toEqual(spaced);
        });
        it('converts to hyphens', function() {
            expect(spaced.hyphenate()).toEqual(hyphnd);
            expect(uscord.hyphenate()).toEqual(hyphnd);
            expect(cameld.hyphenate()).toEqual(hyphnd);
            expect(mixed.hyphenate()).toEqual(hyphnd);
        });
        it('removes hyphens', function() {
            expect(hyphnd.deHyphenate()).toEqual(spaced);
        });
        it('converts to camelCase', function() {
            expect(spaced.camelCase()).toEqual(cameld);
            expect(hyphnd.camelCase()).toEqual(cameld);
            expect(uscord.camelCase()).toEqual(cameld);
            expect(mixed.camelCase()).toEqual(cameld);
        });
        it('undoes camelCasing', function() {
            expect(cameld.deCamelCase()).toEqual(spaced);
        });
        it('formats using ordered placeholders');
        it('formats using named placeholders');
    });
});
