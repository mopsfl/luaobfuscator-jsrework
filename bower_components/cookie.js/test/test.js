(function() {

  'use strict';

  var assert = this.assert;

  describe('cookie', function() {

    function MockCookie() {
      this.value_ = '';

      Object.defineProperty(this, 'cookie', {
        get: function() {
          return this.value_;
        },
        set: function(value) {
          this.value_ += (this.value_ && '; ') + value;
        }
      });
    }

    describe('.get()', function() {

      beforeEach(function() {
        cookie.config.raw = false;

        window.mock = new MockCookie;
        window.mock.cookie = 'name=value';
        window.mock.cookie = 'quote=%22quote%22';
        window.mock.cookie = 'iroha=%E3%81%84%E3%82%8D%E3%81%AF';
      });

      afterEach(function() {
        delete window.mock;
      });

      it('should got cookie-pairs', function() {
        assert.deepEqual(cookie.get(), {
          name: 'value',
          quote: '"quote"',
          iroha: 'いろは'
        });
      });

      it('should got cookie-pairs, raw mode is true', function() {
        cookie.config.raw = true;

        assert.deepEqual(cookie.get(), {
          name: 'value',
          quote: '%22quote%22',
          iroha: '%E3%81%84%E3%82%8D%E3%81%AF'
        });
      });

      it('should got cookie-value', function() {
        assert(cookie.get('name') === 'value');
        assert(cookie.get('quote') === '"quote"');
        assert(cookie.get('iroha') === 'いろは');
      });

      it('should got cookie-value, raw mode is true', function() {
        cookie.config.raw = true;

        assert(cookie.get('name') === 'value');
        assert(cookie.get('quote') === '%22quote%22');
        assert(cookie.get('iroha') === '%E3%81%84%E3%82%8D%E3%81%AF');
      });

      it('should got null when cookie-name is not found', function() {
        assert(cookie.get('unknown') === null);
      });

    });

    describe('.set()', function() {

      beforeEach(function() {
        cookie.config.raw = false;

        window.mock = new MockCookie;
      });

      afterEach(function() {
        delete window.mock;
      });

      it('should set cookie-pairs', function() {
        cookie.set([
          {
            name: 'name',
            value: 'value',
            domain: 'localhost',
            maxage: 1423839600000
          },
          {
            name: 'quote',
            value: '"quote"',
            path: '/',
            secure: true
          },
          {
            name: 'iroha',
            value: 'いろは',
            expires: 'Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
          }
        ]);

        assert(window.mock.cookie ===
            'name=value; Max-Age=1423839600000; Domain=localhost; ' +
            'quote=%22quote%22; Path=/; Secure; ' +
            'iroha=%E3%81%84%E3%82%8D%E3%81%AF; ' +
            'Expires=Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
        );
      });

      it('should set cookie-pairs, raw mode is true', function() {
        cookie.config.raw = true;

        cookie.set([
          {
            name: 'name',
            value: 'value',
            domain: 'localhost',
            maxage: 1423839600000
          },
          {
            name: 'quote',
            value: '"quote"',
            path: '/',
            secure: true
          },
          {
            name: 'iroha',
            value: 'いろは',
            expires: 'Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
          }
        ]);

        assert(window.mock.cookie ===
            'name=value; Max-Age=1423839600000; Domain=localhost; ' +
            'quote="quote"; Path=/; Secure; ' +
            'iroha=いろは; ' +
            'Expires=Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
        );
      });

      it('should set cookie-pair', function() {
        cookie.set('name', 'value', {
          maxage: '1423839600000',
          domain: 'localhost'
        });
        cookie.set('quote', '"quote"', {
          path: '/',
          secure: true
        });
        cookie.set('iroha', 'いろは', {
          expires: 'Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
        });

        assert(window.mock.cookie ===
            'name=value; Max-Age=1423839600000; Domain=localhost; ' +
            'quote=%22quote%22; Path=/; Secure; ' +
            'iroha=%E3%81%84%E3%82%8D%E3%81%AF; ' +
            'Expires=Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
        );
      });

      it('should set cookie-pair, raw mode is true', function() {
        cookie.config.raw = true;

        cookie.set('name', 'value', {
          maxage: '1423839600000',
          domain: 'localhost'
        });
        cookie.set('quote', '"quote"', {
          path: '/',
          secure: true
        });
        cookie.set('iroha', 'いろは', {
          expires: 'Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
        });

        assert(window.mock.cookie ===
            'name=value; Max-Age=1423839600000; Domain=localhost; ' +
            'quote="quote"; Path=/; Secure; ' +
            'iroha=いろは; ' +
            'Expires=Sat Feb 14 2015 00:00:00 GMT+0900 (JST)'
        );
      });

      it('can be method chain', function() {
        cookie
          .set('name1', 'value1')
          .set('name2', 'value2')
          .set('name3', 'value3');

        assert(window.mock.cookie ===
            'name1=value1; ' +
            'name2=value2; ' +
            'name3=value3'
        );
      });

    });

  });

}).call(this);
