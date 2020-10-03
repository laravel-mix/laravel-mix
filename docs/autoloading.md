# Autoloading

-   [Basic Usage](#basic-usage.md)

Webpack offers the necessary functionality to make any module available as a variable within every other module required by webpack.

If you're working with a particular plugin or library that depends upon a global variable - jQuery being the most common example - `mix.autoload()` may prove useful to you.

### Basic Usage

Consider the following example:

```js
mix.autoload({
    jquery: ['$', 'window.jQuery']
});
```

This snippet declares that every time webpack encounters the `$` or `window.jQuery` variables, it should swap them out with `var $ = require('jquery')`.
