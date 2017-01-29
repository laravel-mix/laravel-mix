# Event Hooks

```js
mix.then(function () {});
```

It's possible that you may need to listen for each time Webpack has finished compiling. Perhaps you want to manually apply some bit of logic that is appropriate for your application. If so, you may use the `mix.then()` method to register any callback function. Here's an example:

```js
mix.js('resources/assets/js/app.js', 'public/js')
   .then(() => {
        console.log('Webpack has finished building!');
   });
```
