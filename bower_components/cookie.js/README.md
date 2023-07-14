# cookie.js

[![Build Status](https://travis-ci.org/sasaplus1/cookie.js.png)](https://travis-ci.org/sasaplus1/cookie.js)
[![Dependency Status](https://gemnasium.com/sasaplus1/cookie.js.png)](https://gemnasium.com/sasaplus1/cookie.js)

library for Cookie

## Installation

```sh
$ bower install cookie.js
```

## Usage

```html
<script src="cookie.min.js"></script>
```

## Example

```js
// document.cookie
// => "name=value; iroha=%E3%81%84%E3%82%8D%E3%81%AF"

cookie.get('name');
// => "value"

cookie.get();
// => {
//   name: "value",
//   iroha: "いろは"
// }

cookie.config.raw = true;
cookie.get();
// => {
//   name: "value",
//   iroha: "%E3%81%84%E3%82%8D%E3%81%AF"
// }
```

```js
cookie.set('sushi', '寿司');
// append "sushi=%E5%AF%BF%E5%8F%B8" to Cookie

cookie.config.raw = true;
cookie.set('sushi', '寿司');
// append "sushi=寿司" to Cookie
```

```js
// set cookie-pair with attributes
cookie.set('cookie-name1', 'cookie-value1', {
  expires: 'Fri, 13 Feb 2015 15:00:00 GMT',
  maxage: 60,
  domain: 'github.com',
  path: '/',
  secure: true
});

// multiple set
cookie.set([
  {
    name: 'cookie-name2',
    value: 'cookie-value2',
    secure: true
  },
  {
    name: 'cookie-name3',
    value: 'cookie-value3',
    path: '/'
  }
]);

// method chain
cookie
  .set('cookie-name4', 'cookie-value4')
  .set('cookie-name5', 'cookie-value5');
```

## Variables

### cookie.config.raw

raw mode flag. use encodeURIComponent/decodeURIComponent when `raw` is false.

default is false.

## Functions

### get([name])

- `name`
  - `String` - cookie-name
- `return`
  - `String|Object|Null` - cookie-value or cookie-pairs

get cookie-value or cookie-pairs.

return null when cookie-name is not found.

### set(name, value[, options])

- `name`
  - `String` - cookie-name
- `value`
  - `String` - cookie-value
- `options` (optional)
  - `Object` - attributes
- `return`
  - `Object` - own instance

set cookie-pair to Cookie.

can set below to `options`:

- `expires`
  - `String`
- `maxage`
  - `Number`
- `domain`
  - `String`
- `path`
  - `String`
- `secure`
  - `Boolean`

### set(cookiePairs)

- `cookiePairs`
  - `Object[]` - cookie-pairs
- `return`
  - `Object` - own instance

set cookie-pairs to Cookie.

## Test

```sh
$ npm install
$ npm run testem
```

## License

The MIT license. Please see LICENSE file.
