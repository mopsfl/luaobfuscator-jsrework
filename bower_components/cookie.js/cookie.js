/*!
 * @license cookie.js Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/cookie.js
 * Released under the MIT license.
 */


/**
 * export to AMD/CommonJS/global.
 *
 * @param {Object} global global object.
 * @param {Function} factory factory method.
 */
(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && !!define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    global.cookie = factory();
  }
}(this, function () {
  'use strict';

  var util, config;

  util = {
    // use Array.isArray if implemented.
    isArray: (typeof Array.isArray === 'function') ?
      function (obj) {
        return Array.isArray(obj);
      } :
      function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      }
  };

  config = {
    raw: false
  };

  /**
   * get cookie.
   * get all if name is an undefined.
   *
   * @param {String} name cookie-name.
   * @return {String|Null|Object} cookie-value or cookie-pairs.
   */
  function get(name) {
    var cookiePairs, i, len;

    if (arguments.length === 0) {
      // drop code when compressing
      if (typeof Mocha !== 'undefined') {
        return convertToCookieObject_(splitToPairs_(window.mock.cookie));
      } else {
        return convertToCookieObject_(splitToPairs_(document.cookie));
      }
    }

    // drop code when compressing
    if (typeof Mocha !== 'undefined') {
      cookiePairs = splitToPairs_(window.mock.cookie);
    } else {
      cookiePairs = splitToPairs_(document.cookie);
    }

    for (i = 0, len = cookiePairs.length; i < len; ++i) {
      if (cookiePairs[i].name === name) {
        return decode_(cookiePairs[i].value);
      }
    }

    return null;
  }

  /**
   * set cookie.
   * it can multiple set if name is an Array of Object.
   *
   * @param {String|Object[]} name cookie-name.
   * @param {String|Undefined} value cookie-value.
   * @param {Object|Undefined} options attributes object.
   * @return {Object} own instance.
   */
  function set(name, value, options) {
    var pair, pairs, i, len;

    if (!util.isArray(name)) {
      pair = options || {};
      pair.name = name;
      pair.value = value;

      // drop code when compressing
      if (typeof Mocha !== 'undefined') {
        window.mock.cookie = generateCookieString_(pair);
      } else {
        document.cookie = generateCookieString_(pair);
      }

      // method chain
      return this;
    }

    pairs = name;

    // drop code when compressing
    if (typeof Mocha !== 'undefined') {
      for (i = 0, len = pairs.length; i < len; ++i) {
        window.mock.cookie = generateCookieString_(pairs[i]);
      }
    } else {
      for (i = 0, len = pairs.length; i < len; ++i) {
        document.cookie = generateCookieString_(pairs[i]);
      }
    }

    // method chain
    return this;
  }

  /**
   * generate cookie string from data object.
   *
   * @private
   * @param {Object} object cookie data object.
   * @return {String} cookie string.
   */
  function generateCookieString_(object) {
    var cookieString = object.name + '=' + encode_(object.value);

    if (typeof object.expires !== 'undefined') {
      cookieString += '; Expires=' + object.expires;
    }
    if (typeof object.maxage !== 'undefined') {
      cookieString += '; Max-Age=' + object.maxage;
    }
    if (typeof object.domain !== 'undefined') {
      cookieString += '; Domain=' + object.domain;
    }
    if (typeof object.path !== 'undefined') {
      cookieString += '; Path=' + object.path;
    }
    if (typeof object.secure !== 'undefined') {
      cookieString += '; Secure';
    }

    return cookieString;
  }

  /**
   * split to cookie-name and cookie-value from cookie-pairs.
   *
   * IETF:
   *   http://tools.ietf.org/html/rfc6265
   * japanese translation:
   *   http://www.hcn.zaq.ne.jp/___/WEB/RFC6265-ja.html
   *
   * cookie-name = token
   * cookie-value = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
   * cookie-octet = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
   *
   * token = 1*<any CHAR except CTLs or separators>
   *
   * CTL = \x00-\x1f \x7f (0-31, 127)
   * SEPARATOR = \x28 \x29 \x3c \x3e \x40
   *             \x2c \x3b \x3a \x5c \x22
   *             \x2f \x5b \x5d \x3f \x3d
   *             \x7b \x7d \x20 \x09
   *
   * ctl:
   *   00-1f 7f
   *
   * sorted separator:
   *   09 20 22 28 29
   *   2c 2f 3a 3b 3c
   *   3d 3e 3f 40 5b
   *   5c 5d 7b 7d
   *
   * cookie-name:
   *   \x00-\x20\x22\x28\x29\x2c\x2f\x3a-\x40\x5b-\x5d\x7b\x7d\x7f
   * cookie-value:
   *   \x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E
   *
   * pairs = text.split(';')
   * re = /([^\x00-\x1f "(),/:-@\[-\]{}\x7f]+)=(")?([!#-+\--:<-\[\]-~]*)\2/
   *
   * @private
   * @param {String} text cookie string.
   * @return {{name, value: String}[]} splitted cookie-pairs.
   */
  function splitToPairs_(text) {
    var pairs = text.split('; '),
      result = [],
      i, len, equalIndex;

    for (i = 0, len = pairs.length; i < len; ++i) {
      equalIndex = pairs[i].indexOf('=');

      if (equalIndex === -1) {
        continue;
      }

      result.push({
        name: pairs[i].slice(0, equalIndex),
        value: pairs[i].slice(equalIndex + 1)
      });
    }

    return result;
  }

  /**
   * convert to cookie object from cookie object array.
   *
   * @private
   * @param {Object} cookieObjects cookie object array.
   * @return {Object} cookie object
   */
  function convertToCookieObject_(cookieObjects) {
    var pairs = {},
      i, len;

    for (i = 0, len = cookieObjects.length; i < len; ++i) {
      pairs[cookieObjects[i].name] = decode_(cookieObjects[i].value);
    }

    return pairs;
  }

  /**
   * encode text.
   * not encode if config.raw is true.
   *
   * @private
   * @param {String} text encode target.
   * @return {String} encoded text.
   */
  function encode_(text) {
    return (!!config.raw) ? text : encodeURIComponent(text);
  }

  /**
   * decode text.
   * not decode if config.raw is true.
   *
   * @private
   * @param {String} text encode target.
   * @return {String} decoded text.
   */
  function decode_(text) {
    return (!!config.raw) ? text : decodeURIComponent(text);
  }

  return {
    config: config,
    get: get,
    set: set,
    version: "1.4.2"
  };
}));
