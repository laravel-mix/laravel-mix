# Webpack Configuration

-   [Basic Usage](#basic-usage)
-   [Passing a Callback Function](#passing-a-callback-function)

In certain cases, it may prove easier to drop down a level and override the underlying webpack configuration directly. Mix provides the `mix.webpackConfig()` command to allow for this.

### Basic Usage

```js
// 1. Pass an object.
mix.webpackConfig({
    plugins: []
});

// 2. Pass a callback function.
mix.webpackConfig(webpack => {
    return {
        plugins: []
    };
});
```

As an example, perhaps you want to provide an array of modules that should be automatically loaded by webpack. We'll use Laravel Spark as an example.

```js
mix.webpackConfig({
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'vendor/laravel/spark/resources/assets/js')
        ]
    }
});
```

The object passed to `mix.webpackConfig()` will now smartly be merged with Mix's generated webpack configuration.

### Passing a Callback Function

You may alternatively access webpack and all of its properties by passing a callback function.

```js
mix.webpackConfig(webpack => {
    return {
        plugins: [
            new webpack.ProvidePlugin({
                //
            })
        ]
    };
});
```
