# Event Hooks

- [Webpack Compilation Hook](#webpack-compilation-hook)


### Webpack Compilation Hook

If you need to call a custom function each time webpack compiles, reach for the `mix.then()` method. Here's an example:

```js
mix.js('resources/assets/js/app.js', 'public/js')
   .then(stats => {
       // webpack compilation complete
   });
```

This callback function will be passed a webpack `Stats` object.  Below is an example that logs a list of all compiled assets.

```js
mix.js('resources/assets/js/app.js', 'public/js').then(stats => {
    console.log(Object.keys(stats.compilation.assets));
});
```

The official documentation for the `Stats` object [may be found here](https://github.com/webpack/docs/wiki/node.js-api#stats).
