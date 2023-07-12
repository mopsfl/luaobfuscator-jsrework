(function() {
    'use strict';

    /**
     * Capitalises the first letter of every word in a string.
     * @return {string} capitalised string
     */
    String.prototype.capitalise = function() {
        var words = this.split(' '),
            cappd = [],
            l     = words.length;

        for(var i = 0; i < l; i++) {
            var word = words[i];
            cappd.push(word[0].toUpperCase() + word.substr(1));
        }

        return cappd.join(' ');
    };

    /**
     * Replaces underscores with spaces.
     * @return {string} de-underscored string
     */
    String.prototype.deUnderscore = function() {
        return this.replace(/_+/g, ' ');
    };

    /**
     * Replaces hyphens with spaces in a string.
     * @return {string} de-hyphenated string
     */
    String.prototype.deHyphenate = function() {
        return this.replace(/\-+/g, ' ');
    };

    /**
     * Replaces camelCasing with spaces in a string.
     * @return {string} de-camelCased string
     */
    String.prototype.deCamelCase = function() {
        return this.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    };

    /**
     * Puts underscores instead of hyphens, spaces and camelCase.
     * @return {string} underscored string
     */
    String.prototype.underscore = function() {
        return this.deHyphenate().deCamelCase().replace(/\s+/g, '_').toLowerCase();
    };

    /**
     * Puts hyphens instead of underscores, spaces and camelCase.
     * @return {string} hyphenated string
     */
    String.prototype.hyphenate = function() {
        return this.deUnderscore().deCamelCase().replace(/\s+/g, '-').toLowerCase();
    };

    /**
     * Puts camelCase instead of spaces, hyphens and underscores.
     * @return {string} camelCased string
     */
    String.prototype.camelCase = function() {
        return this.deUnderscore().deHyphenate().replace(/\s+(\w)/g, function(all, m) { return m.toUpperCase(); }).replace(/\s+/g, '');
    };

    /**
     * Formats a string by substituting placeholders for values
     * @return {string} formatted string
     */
    String.prototype.format = function() {
        throw new Error('Not implemented.');
    };

    // AMD - requirejs
    if(typeof define == 'function') {
        define([], function() { return String; });
    }

    // Node.js / CommonJS module
    if(typeof module != 'undefined') {
        module.exports = String;
    }
})();
