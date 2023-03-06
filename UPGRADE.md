## Upgrade to Mix 6

-   [Review Your Dependencies](#review-your-dependencies)
-   [Check Your Node Version](#check-your-node-version)
-   [Update Your NPM Scripts](#update-your-npm-scripts)
-   [Watch Ignores Node_Modules](#watch-ignores-node_modules)
-   [API for JavaScript Frameworks](#api-for-javascript-frameworks)
-   [Vue Configuration](#vue-configuration)
-   [Legacy Node Polyfills](#legacy-node-polyfills)
-   [Autoprefixer Options](#autoprefixer-options)
-   [Unused Library Extraction](#unused-library-extraction)
-   [Automatically Ignored Node Modules](#automatically-ignore-node-modules)
-   [Did We Miss Something?](#did-we-miss-something)

```bash
npm install laravel-mix@latest
```

### Review Your Dependencies

Laravel Mix 6 ships with support for the latest versions of numerous dependencies, including webpack 5, PostCSS 8, Vue
Loader 16, and more. These are significant releases with their own sets of breaking changes. We've done our best to
normalize these changes, but it's still particularly important that you take the time to fully test your build after
upgrading to Mix 6.

Please review your `package.json` dependencies list for any third-party tools or plugins that may not yet be compatible
with webpack 5 or PostCSS 8.

### Check Your Node Version

Mix has bumped its minimum Node requirement from version 8 to 12.14.0. Please check which version you have installed (`node -v`) and ensure that it meets this requirement.

### Update Your NPM Scripts

If your build throws an error such as `Unknown argument: --hide-modules`, the `scripts` section of your `package.json`
file will need to be updated. The Webpack 5 CLI removed a number of options that your NPM scripts was likely
referencing.

While you're at it, go ahead and switch over to the new Mix CLI.

##### Before

```js
"scripts": {
    "development": "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
    "watch": "npm run development -- --watch",
    "watch-poll": "npm run watch -- --watch-poll",
    "hot": "cross-env NODE_ENV=development node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --hot --disable-host-check --config=node_modules/laravel-mix/setup/webpack.config.js",
    "production": "cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --no-progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js"
}
```

##### After

```js
"scripts": {
    "development": "mix",
    "watch": "mix watch",
    "watch-poll": "mix watch -- --watch-options-poll=1000",
    "hot": "mix watch --hot",
    "production": "mix --production"
}
```

### Watch Ignores Node_Modules

Mix will now ignore the `node_modules/` directory when watching files for changes. This allows for a nice performance
boost. However, if your project depends on that functionality, you may override the generated webpack configuration,
like so:

```
mix.override((config) => {
    delete config.watchOptions;
});
```

### API for JavaScript Frameworks

Laravel Mix was originally built to be quite opinionated. One of these opinions was that Vue support should be provided
out of the box. Any call to `mix.js()` would instantly come with the benefit of Vue single-file components.

Though we're not removing Vue support by any stretch, we _have_ extracted Vue to its own "featured flag": `mix.vue()`.

##### Before

```js
mix.js('resources/js/app.js', 'public/js');
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').vue();
```

Think of this as your way of saying, "_I want to compile my JavaScript **and also** turn on Vue support._" Mix will
automatically detect whether you have Vue 2 or 3 installed, based on your dependencies list. However, if you'd rather be
explicit...

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

In line with the previous change, any Vue-specific configuration that was stored on the global `Config` object should
now be passed directly to the `mix.vue()` command, like so:

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

### Legacy Node Polyfills

Webpack 5 no longer automatically includes polyfills for Node-specific objects like `Buffer` and `process`. However,
it's possible that your project, or one of its dependencies, still requires access to these variables. If so, you can
force Mix to include the necessary Node polyfills via the `legacyNodePolyfills` option.

```js
mix.options({
    legacyNodePolyfills: true
});
```

Keep in mind that this might result in a slightly larger bundle. If possible, take the necessary steps to eventually
remove these references from your front-end code - and then turn off `legacyNodePolyfills` to reduce your bundle size.

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

When given `mix.extract(["library-1", "library-2"])`, Mix would previously extract the referenced libraries to a file **
regardless** of whether they're used in the main JS bundle. Mix 6, however, extracts **only** the libraries that are
used by your JS bundle. This means that these libraries are now also eligible for tree-shaking.

With this change, libraries should no longer be duplicated in multiple files. For example, if you used `vue` in your JS
bundle and called `mix.extract(["vue"])` it was possible in some scenarios for Vue to be included in both the vendor
file **and** your app JS file. This should no longer happen.

Should you need to preserve the behavior of all listed libraries being included, you'll need to create a file that
imports the necessary libraries. It may also be necessary for you to disable tree-shaking optimizations.

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

Mix will now ignore the `node_modules` directory when watching for changes. If your current `webpack.mix.js` file does
this explicitly, it can now safely be removed.

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
