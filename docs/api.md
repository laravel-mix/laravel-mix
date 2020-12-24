# The Mix API

Below, you'll find the full Mix API. Out of the box, Mix supports a wide array of frameworks and preprocessors.

The methods below assume that you've imported `mix` at the top of your `webpack.mix.js` file, like so:

```js
let mix = require('laravel-mix');
```

### `.js(src, output)`

Bundle your JavaScript assets.

```js
mix.js('src/file.js', 'dist/file.js');
```

### `.ts(src, dist)`

Bundle your TypeScript assets.

```js
mix.ts('src/file.ts', 'dist/file.js');
```

### `.vue(options?)`

Add support for Vue single file components.

```js
mix.js('src/file.js', 'dist/file.js').vue();
```

Vue 2 and 3 differ slightly in how they should be bundled. Mix will do its best to check which
version you currently have installed; however, if you wish, you can be explict.

```js
mix.js('src/file.js', 'dist/file.js').vue({ version: 2 });
```

### `.react()`

Add support for React compilation.

```js
mix.js('src/file.js', 'dist/file.js').react();
```

### `.preact()`

Add support for Preact compilation.

```js
mix.js('src/file.js', 'dist/file.js').preact();
```

### `.coffee(src, output)`

Preprocess CoffeeScript files.

```js
mix.coffee('src/file.coffee', 'dist/file.js');
```

### `.postCss(src, output, plugins[]?)`

Compile PostCss files.

```js
mix.postCss('src/file.css', 'dist/file.css', [
    require('precss')() // your PostCss plugins
]);
```

### `.sass(src, output, sassPluginOptions?)`

Compile Sass files.

```js
mix.sass('src/file.scss', 'dist/file.css');
```

### `.less(src, output)`

Compile Less files.

```js
mix.less('src/file.less', 'dist/file.css');
```

### `.stylus(src, output)`

Compile Stylus files.

```js
mix.stylus('src/file.styl', 'dist/file.css');
```

### `.extract(vendors?)`

Use webpack code-splitting to extract any or all vendor dependencies into their own files.

```js
mix.js('src/file.js', 'dist/file.js').extract(['vue']);
```

When no dependency is provided, Mix will bundle all imported dependencies from the `node_modules/` directory to a `vendor.js` file.

```js
mix.js('src/file.js', 'dist/file.js').extract();
```

### `.version(files[]?)`

Version all compiled assets by appending a unique hash to every file within `mix-manifest.json`. This is useful for cache-busting purposes.

```js
mix.js('src/file.js', 'dist/file.js').version();
```

If using Laravel, refer to its global `mix()` helper function for dynamically accessing this hashed file path.

```html
<script src="{{ mix('js/app.js') }}"></script>
```

### `.sourceMaps(generateForProduction?, devType?, productionType?)`

Generate JavaScript source maps.

```js
mix.js('src/file.js', 'dist/file.js').sourceMaps();
```

### `.browserSync(domain)`

Monitor files for changes and update the browser without requiring a manual page refresh.

```js
mix.js('...').browserSync('your-domain.test');
```

### `.setPublicPath(path)`

Set the path to where all public assets should be compiled to. For non-Laravel projects, always include a call to this method.

```js
mix.setPublicPath('dist');
```

### `.webpackConfig(config)`

Merge a webpack configuration object with the one Mix has generated. This can be useful when you want to drop down a level and manipulate the webpack configuration directly.

```js
mix.webpackConfig({
    plugins: [new SomeWebpackPlugin()]
});
```

### `.override(fn(webpackConfig))`

Register a handler for _after_ the webpack configuration has been fully constructed. This is your last chance to override Mix's configuration before the compiling begins.

```js
mix.override(webpackConfig => {
    webpackConfig.module.rules.push({
        test: /\.extension$/,
        use: []
    });
});
```

### `.dump()`

Log the generated webpack configuration to the console. This is temporary command that may be useful for debugging purposes.

```js
mix.dump();
```

### `.autoload(libraries)`

Make a module available as a variable in every other module required by webpack. If you're working with a particular plugin or library that depends upon a global variable, such as jQuery, this command may prove useful.

```js
mix.autoload({
    jquery: ['$', 'window.jQuery']
});
```

### `.before(callback)`

Run the given callback function before the webpack compilation begins. 

```js
mix.before(() => {
    fs.copySync('path/from', 'path/to');
});
```

If your script is asynchronous, you must return a promise to ensure that Mix waits for it to complete before beginning the compilation.

```js
mix.before(() => {
    return new Promise(resolve => {
        setTimeout(resolve, 2000); 
    });
});
```

### `.after(callback)`

Run the given callback function after the webpack compilation has completed.

```js
mix.after(webpackStats => {
    console.log('Compilation complete');
});
```

### `.options(options)`

Merge and override Mix's default configuration settings. Refer to this package's `src/Config.js` file for a full list of settings that can be overridden.

Below is a brief list of the most common overrides.

```js
mix.options({
    processCssUrls: false,
    postCss: [],
    terser: {},
    autoprefixer: {},
    legacyNodePolyfills: false
});
```
