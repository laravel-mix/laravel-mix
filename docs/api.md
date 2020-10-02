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

### `.browserSync(domain)`

Monitor files for changes and update the browser without requiring a manual page refresh.

```js
mix.js('...').browserSync('your-domain.test');
```
