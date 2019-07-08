# Quick webpack Configuration

```js
mix.webpackConfig({} || cb);
```

In some cases, it may prove easier to override the underlying webpack configuration directly. 

As an example, perhaps you want to add a custom array of modules that should be automatically loaded by webpack. We'll use Laravel Spark as an example.

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

The object passed to the `webpackConfig()` method will now be merged with Mix's generated config object.


## Using a Callback Function

You may alternatively access webpack and all of its properties by passing a callback function.

```js
mix.webpackConfig(webpack => {
    return {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ]
    };
});
```
