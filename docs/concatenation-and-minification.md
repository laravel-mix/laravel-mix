# Concatenation and Minification

```js
mix.combine(['src', 'files'], 'destination');
mix.minify('src');
mix.minify(['src']);
```

If used properly, Laravel Elixir and Webpack should take care of all the necessary module bundling and minification for you. However, you may have some legacy code or vendor libraries that need to be concatenated and minified. Not a problem.

### Combine Files

Consider the following snippet:

```js
mix.combine(['one.js', 'two.js'], 'merged.js');
```

This will naturally merge `one.js` and `two.js` into a single file, called `merged.js`. As always, during development, that merged file will remain uncompressed. However, for production \(`export NODE_ENV=production`\), this command will additionally minify `merged.js`.

### Minify Files

Similarly, you may also minify one or more files with the `mix.minify()` command.

```js
mix.minify('path/to/file.js');
mix.minify(['this/one.js', 'and/this/one.js']);
```

There are a few things worth noting here:

1. This method will overwrite the existing file.
2. Once again, the minification will only take place during a production build. \(`export NODE_ENV=production`\).
3. There is no need to call `mix.combine(['one.js', 'two.js'], 'merged.js').minify('merged.js');`Just stick with the single `mix.combine()` call. It'll take care of both.

> **Important**: Please note that minification is only available for CSS and JavaScript files. The minifier will not understand any other provided file type.



