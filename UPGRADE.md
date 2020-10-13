## Upgrade to Mix 6

-   [Review Your Dependencies](#review-your-dependencies)
-   [API for JavaScript Frameworks](#api-for-javascript-frameworks)
-   [Vue Configuration](#vue-configuration)
-   [Autoprefixer Options](#autoprefixer-options)
-   [Unused Library Extraction](#unused-library-extraction)
-   [Automatically Ignored Node Modules](#automatically-ignore-node-modules)
-   [Did We Miss Something?](#did-we-miss-something)

```bash
npm install laravel-mix@next
```

### Review Your Dependencies

Laravel Mix 6 ships with support for the latest versions of numerous dependencies, including webpack 5, PostCSS 8, Vue Loader 16, and more.
These are significant releases with their own sets of breaking changes. We've done our best to normalize these changes, but it's still particularly important that you take the time to fully test your build after upgrading to Mix 6.

Please review your `package.json` dependencies list for any third-party tools or plugins that may not yet be compatible with webpack 5 or PostCSS 8.

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

Think of this as your way of saying, "_I want to compile my JavaScript **and also** turn on Vue support._" Mix will automatically detect whether you have Vue 2 or 3 installed, based on your dependencies list.
However, if you'd rather be explicit...

```js
mix.js('resources/js/app.js', 'public/js').vue({ version: 2 });
```

The same is true for React.

##### Before

```js
mix.react('resources/js/app.js', 'public/js');
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').react();
```

### Vue Configuration

In line with the previous change, any Vue-specific configuration that was stored on the global `Config` object should now
be passed directly to the `mix.vue()` command, like so:

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

> Please note the slight property name change: `extractVueStyles` => `extractStyles`.

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

You can disable autoprefixer entirely, by setting it to `false`.

```js
mix.options({
    autoprefixer: false
});
```

### Unused Library Extraction

When given `mix.extract(["library-1", "library-2"])`, Mix would previously extract the referenced libraries to a file **regardless** of whether they're used in the main JS bundle.
Mix 6, however, extracts **only** the libraries that are used by your JS bundle. This means that these libraries are now also eligible for tree-shaking.

With this change, libraries should no longer be duplicated in multiple files. For example, if you used `vue` in your JS bundle and called `mix.extract(["vue"])` it was possible in some scenarios for Vue to be included in both the vendor file **and** your app JS file. This should no longer happen.

Should you need to preserve the behavior of all listed libraries being included, you'll need to create a file that imports the necessary libraries. It may also be necessary for you to disable tree-shaking optimizations.

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

### Automatically Ignore Node Modules

Mix will now ignore the `node_modules` directory when watching for changes. If your current `webpack.mix.js` file does this explicitly, it can now safely be removed.

##### Before

```js
mix.js('src/app.js', 'dist');

mix.webpackConfig({
    watchOptions: { ignored: /node_modules/ }
});
```

##### After

```js
mix.js('src/app.js', 'dist');
```

### Did We Miss Something?

If you've run into an issue that hasn't been documented here, please submit an issue or pull request.
