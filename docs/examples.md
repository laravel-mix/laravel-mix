# Examples

### Compile Modern JavaScript

```js
mix.js('src/app.js', 'js');
```

### Compile Sass

```js
mix.sass('src/app.scss', 'css');
```

### Compile JavaScript and Sass

```js
mix.js('src/app.js', 'js')
   .sass('src/app.scss', 'css');
```

### Compile JavaScript and Set the Output Base Directory

```js
mix.js('src/app.js', 'js')
   .sass('src/app.scss', 'css')
   .setPublicPath('dist');
```

### Compile CSS With PostCSS Plugins

```js
mix.postCss('src/app.css', 'dist', [
    require('postcss-custom-properties')
]);
```

### Compile JavaScript With File Versioning

```js
mix.js('src/app.js', 'js')
   .version();
```

Once compiled, the hash can be retrieved from your `mix-manifest.json` file.

### Compile JavaScript With Support for Vue Single File Components

```js
mix.js('src/app.js', 'js')
   .vue();
```

### Compile JavaScript and Set an Explicit Vue Version

```js
mix.js('src/app.js', 'js')
   .vue({ version: 3 });
```

### Extract Vue Single File Component CSS to its Own File

```js
mix.js('src/app.js', 'js')
   .vue({ extractStyles: true });
```

### Extract Vue Single File Component CSS to a named File

```js
mix.js('src/app.js', 'js')
   .vue({ extractStyles: 'css/vue-styles.css' });
```

### Compile JavaScript With Support for React

```js
mix.js('src/app.js', 'js')
   .react();
```

### Compile JavaScript and Extract Lodash to its Own File

```js
mix.js('src/app.js', 'js')
   .extract(['lodash']);
```

### Compile JavaScript and Extract All Vendor Dependencies

```js
mix.js('src/app.js', 'js')
   .extract();
```

### Enable Source Maps

```js
mix.js('src/app.js', 'js')
   .sourceMaps();
```

### Make jQuery Available to Every Module

```js
mix.js('src/app.js', 'js')
   .autoload({
       jquery: ['$', 'window.jQuery']
    });
```

### Trigger Browsersync Page Refreshes When in Watch Mode

```js
mix.js('src/app.js', 'js')
   .sass('src/app.scss', 'css')
   .browserSync('http://your-app.test');
```

Then run `npx mix watch`.

### Load an Environment File Key

```js
// .env
MIX_SOME_KEY=yourpublickey
```

Only keys in your `.env` file that begin with "MIX_" will be loaded.

```js
// webpack.mix.js
mix.js('src/app.js', 'js')
```

```js
// src/app.js
console.log(
    process.env.MIX_SOME_KEY
); // yourpublickey
```

