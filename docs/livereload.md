# LiveReload

While Laravel Mix ships with Browsersync support out of the box, you may prefer to use LiveReload. LiveReload can automatically monitor your files for changes and refresh the page when a modification is detected.

## 1. Install webpack-livereload-plugin

```
npm install webpack-livereload-plugin@1 --save-dev
```

## 2. Configure `webpack.mix.js`

Add the following lines to the bottom of your webpack.mix.js:

```js
var LiveReloadPlugin = require('webpack-livereload-plugin');

mix.webpackConfig({
    plugins: [new LiveReloadPlugin()]
});
```

Although LiveReload works well with its defaults, a list of available plugin options may be reviewed [here](https://github.com/statianzo/webpack-livereload-plugin/blob/master/README.md).

## 3. Install LiveReload.js

Finally, we need to install LiveReload.js. You may do so through the [LiveReload Chrome plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei),
or by adding the following code just before the closing `</body>` tag in your main site template:

```blade
    @if(config('app.env') == 'local')
        <script src="http://localhost:35729/livereload.js"></script>
    @endif
```

## 4. Run the Dev Server

```bash
npm run watch
```

Now, LiveReload will automatically monitor your files and refresh the page when necessary. Enjoy!
