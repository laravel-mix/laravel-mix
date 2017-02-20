# LiveReload

There is a webpack plugin for those who prefer LiveReload to BrowserSync.
LiveReload will automatically monitor your files for changes and refresh the page when the changes are detected.

To make LiveReload work for your Laravel (^5.4) site, do the following:

## 1. Install webpack-livereload-plugin

```
npm install --save-dev webpack-livereload-plugin
```

## 2. Configure Laravel.mix

Add the following lines to the bottom of your webpack.mix.js:

```js
var LiveReloadPlugin = require('webpack-livereload-plugin');

mix.webpackConfig({
    plugins: [
        new LiveReloadPlugin()
    ]
});
```

Although Webpack LiveReload plugin works well with its defaults, a list of available options which you may pass to LiveRealodPlugin is available in [the plugin documentation](https://github.com/statianzo/webpack-livereload-plugin/blob/master/README.md).

## 3. Install LiveReload.js to your site

You may do it through [LiveReload Chrome plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
or by adding the following code right before the closing </body> tag in your main site template:
 
```blade 
    @if(env('APP_ENV') == 'local')
        <script src="http://localhost:35729/livereload.js"></script>
    @endif
```

## 4. Run the dev server

```bash
npm run watch
```

Now, LiveReload will automatically monitor your files and refresh the page when necessary.

Enjoy.
