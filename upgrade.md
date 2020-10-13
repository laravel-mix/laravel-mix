# Upgrade Steps

Because webpack 5 is a massive release with its own set of breaking changes,
it's especially important that you take the time to test your build after upgrading to Mix 6.

```bash
npm install laravel-mix@next
```

# Breaking Changes

Below, you'll find a short list of the most notable Mix changes that you should be aware of. Don't worry: this will only take you a moment to update.

### API for JavaScript Frameworks

Laravel Mix was originally built to be quite opinionated. One of these opinions was that Vue support should be provided out
of the box. Any call to `mix.js()` would instantly come with the benefit of Vue single-file components.

Though we're not removing Vue support by any stretch, we _have_ extracted Vue to its own "featured flag": `mix.vue()`.

##### Before

```js
mix.js('resources/js/app.js', 'public/js');
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').vue();
```

Think of this as your way of saying, "I want to compile my JavaScript **and also** add Vue support."

The same is true for React.

##### Before

```js
mix.react('resources/js/app.js', 'public/js');
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').react();
```

### Vue Configuration Changes

In line with the previous change, any Vue-specific configuration that was stored on the global `Config` object should now
be passed directly to the `mix.vue()` call, like so:

##### Before

```js
mix.js('resources/js/app.js', 'public/js').options({
    extractVueStyles: true,
    globalVueStyles: false
});
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').vue({
    extractStyles: true,
    globalStyles: false
});
```

> Notice the slight property name change: `extractVueStyles` => `extractStyles`.

### Autoprefixer Options

If your `webpack.mix.js` applied custom Autoprefixer options, we've adjusted and simplified the configuration slightly.

##### Before

```js
mix.options({
    autoprefixer: {
        enabled: true,
        options: { remove: false }
    }
});
```

##### After

```js
mix.options({
    autoprefixer: { remove: false }
});
```

### Goodbye Node Sass

Previous versions of Mix supported both the Dart and Node bindings for Sass. If we detected that `node-sass` was installed for your project, we'd use it. However, due to the number of issues that surround the `node-sass` implementation, as part of Mix 6, we
will exclusively install and use the Dart-specific version (`sass`).

##### Before

```js
mix.sass('resources/sass/app.sass', 'public/css', {
    implementation: require('node-sass')
});
```

##### After

```js
mix.sass('resources/sass/app.sass', 'public/css');
```

### Changes to unused library extraction

Mix when given `mix.extract(["library-1", "library-2"])` would previously extract libraries to a file regardless of whether or not they're used in the main JS bundle. Now, in Mix 6, we extract only the libraries that are used by your JS bundle. This means that these libraries are now also eligible for tree-shaking.

With this change libraries should no longer be duplicated in multiple files. For example, if you used `vue` in your JS bundle and called `mix.extract(["vue])` it was possible in some scenarios for Vue to be included in each the vendor file and your app js file. This should no longer happen.

Should you need to preserve the behavior of all listed libraries being included you can create a file that imports the necessary libraries. It may also be necessary for you to disable tree-shaking optimizations.

##### Before

```js
// webpack.mix.js
mix.extract(['library-1', 'library-2']);
```

##### After

```js
// src/libraries.js
import 'library-1';
import 'library-2';

// webpack.mix.js
mix.js('src/libraries.js');
mix.extract(['library-1', 'library-2']);
mix.webpackConfig({
    optimization: {
        providedExports: false,
        sideEffects: false,
        usedExports: false
    }
});
```

### Changes to `manifest.js` output path

Previously, the path of the runtime chunk (`manifest.js`) depended on the latest `.js()` call in a chain.

Since Laravel Mix 6 the runtime chunk generates to a public directory.

##### Before

```js
// webpack.mix.js
mix.extract(['library-1', 'library-2']);
mix.js('resources/app.js', 'public/js');

// the `manifest.js` is generated to `public/js`
```

```js
// webpack.mix.js
mix.extract(['library-1', 'library-2']);
mix.js('resources/app.js', 'public/js');
mix.js('resources/extra/form.js', 'public/js/extra');

// the `manifest.js` is generated to `public/js/extra`
```

##### After

```js
// webpack.mix.js
mix.extract(['library-1', 'library-2']);
mix.js('resources/app.js', 'public/js');
mix.js('resources/extra/form.js', 'public/js/extra');

// the `manifest.js` is generated to `public`
```

```js
// webpack.mix.js
mix.extract(['library-1', 'library-2']);
mix.js('resources/app.js', 'public/js');
mix.js('resources/extra/form.js', 'public/js/extra');
mix.options({ runtimeChunkPath: 'js' });

// the `manifest.js` is generated to `public/js`
```

# Updates

-   Support for webpack 5
-   Support for Vue 2 and 3 applications
-   Upgraded to `postcss-loader` v4.
-   `npx mix` executable
-   **Component:** `mix.alias()`
-   `mix.ts()` now applies Babel transformation just like `mix.js()`
-   Fixed CSS extraction bug when using dynamic imports.
-   Fixed and improved PostCSS plugin autoloading and merging.
-   Fixed an issue related to hot module reloading when versioning is enabled.
