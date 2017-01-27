# Autoloading

```js
mix.autoload({
   jquery: ['$', 'window.jQuery']
});
```

Webpack offers the necessary facilities to make a module available as a variable in every other module required by Webpack. If you're working with a particular plugin or library that depends upon a global variable, such as jQuery, `mix.autoload()` may prove useful to you.

> In fact, because jQuery is such a frequent example, Laravel Mix ships with jQuery autoloading out of the box. Should you need to disable this, you may pass an empty object to `mix.autoload({})`.

Consider the following example:

```js
mix.autoload({
   jquery: ['$', 'window.jQuery']
});
```

This snippet specifies that Webpack should prepend `var $ = require('jquery')` to every location that it encounters either the global `$` identifier, or `window.jQuery`. Nifty!

