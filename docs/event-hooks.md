# Event Hooks

```js
mix.then(function () {});
```

It's possible that you may need to listen for each time webpack has finished compiling. Perhaps you want to manually apply some bit of logic that is appropriate for your application. If so, you may use the `mix.then()` method to register any callback function. Here's an example:

```js
mix.js('resources/assets/js/app.js', 'public/js')
   .then(() => {
        console.log('webpack has finished building!');
   });
```

The callback function will be passed a webpack `Stats` object allowing for inspection of the performed compilation:

```js
mix.js('resources/assets/js/app.js', 'public/js')
   .then((stats) => {
        // array of all asset paths output by webpack
        console.log(Object.keys(stats.compilation.assets));
   });
```

Official documentation for the `Stats` object can be found here: https://github.com/webpack/docs/wiki/node.js-api#stats
