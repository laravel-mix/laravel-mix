# Event Hooks

- [Run a Function Before Webpack Compiles](#run-a-function-before-webpack-compiles)
- [Run a Function After Webpack Compiles](#run-a-function-after-webpack-compiles)

### Run a Function Before Webpack Compiles

In some scenarios, you may need to execute a piece of logic **before** your compilation begins. Perhaps you need to copy a directory or move a file. The `mix.before()` function allows for this.

```js
mix.before(() => {
    console.log('I will be logged before the compilation begins.');
});
```

If the logic you're executing is asynchronous, be sure to return a `Promise` from your callback function, like so:

```js
mix.before(stats => {
    return new Promise(
        resolve => setTimeout(resolve, 2000)
    );
});
```

Mix will not begin its compilation until all `before` hooks have fully resolved. As such, for this example the compilation would begin after two seconds.

### Run a Function After Webpack Compiles

If, on the other hand, you need to execute a piece of logic **after** webpack has completed its compilation, reach for the `mix.after()` method - or its alias, `mix.then()`.

```js
mix.js('src/app.js', 'dist')
   .after(stats => {
       // webpack compilation has completed
   });
```

This callback function will be passed a webpack `Stats` object. As an example, let's log a list of all compiled assets.

```js
mix.js('resources/assets/js/app.js', 'public/js').then(stats => {
    console.log(Object.keys(stats.compilation.assets));
});
```

The official documentation for the `Stats` object [may be found here](https://github.com/webpack/docs/wiki/node.js-api#stats).
