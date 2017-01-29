# Quick Webpack Configuration

```js
 mix.webpackConfig({});
```

While, of course, you're free to edit the provided `webpack.config.js` file, in certain settings, it's easier to modify or override the default settings directly from your `webpack.mix.js` file. This is particularly true for Laravel apps, where, by default, the `webpack.config.js` isn't available in the project root.

As an example, perhaps you want to add a custom array of modules that should be automatically loaded by Webpack. You have two options in this scenario:

1. Edit your `webpack.config.js` file, as needed.
2. Call `mix.webpackConfig()` within your `webpack.mix.js` file, and pass your overrides. Laravel will then perform a deep merge.

Below, as an example, we'll add a custom module path for Laravel Spark.

```js
mix.webpackConfig({
    resolve: {
        modules: [
            path.resolve(__dirname, 'vendor/laravel/spark/resources/assets/js')
        ]
    }
});
```
