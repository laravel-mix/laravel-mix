# Code Splitting

-   [Basic Usage](#basic-usage)
-   [The Manifest File](#the-manifest-file)

Bundling your JavaScript into a single file has one big downside: each time you change a minor detail in your application code, you must bust the browser cache. Even if you only change a single variable name, users will still need to re-download that generated file.

One solution is to isolate, or extract, your vendor libraries into their own file(s).

-   **Application Code**: `app.js`
-   **Vendor Libraries**: `vendor.js`
-   **Manifest \(webpack Runtime\)**: `manifest.js`

This will result in a significantly smaller `app.js` file. Now, using the above example, if you change a variable name, only the application-specific JavaScript will need to be re-downloaded. The larger vendor libraries - `vendor.js` - may remain cached.

### Basic Usage

```js
// 1. Extract all node_modules vendor libraries into a vendor.js file.
mix.extract();

// 2. Only extract the Vue and jQuery libraries into a vendor.js file.
mix.extract(['vue', 'jquery']);

// 3. Extract Vue and jQuery to custom-vendor-name.js.
mix.extract(['vue', 'jquery'], 'custom-vendor-name.js');
```

If you don't pass an array of npm libraries to the `extract` method, Mix will extract _all_ imported libraries from your project's `node_modules` directory. This is a useful default; however, if you need to be explicit, pass an array of the specific libraries that should be extracted.

Once you compile your code - `npx mix` - you'll find three new files: `app.js`, `vendor.js`, and `manifest.js`. You may reference these at the bottom of your HTML.

```html
<script src="/js/manifest.js"></script>
<script src="/js/vendor.js"></script>
<script src="/js/app.js"></script>
```

While it's true that we're now importing three scripts instead of one, the benefit is improved long-term caching of vendor code that rarely changes. Further, HTTP2 makes the cost of importing multiple scripts a non-issue.

### Customizing the runtime chunk (`manifest.js`) path

By default, the runtime chunk (`manifest.js`) is generated next your JS assets.

However, the path can easily be customized, relative to the public path:

```js
mix.options({ runtimeChunkPath: 'custom' });

// The `manifest.js` file can now be found at `public/custom/manifest.js`
```

If you want to use just the public path for the manifest file you may use `.`:
```js
mix.js('resources/app.js', 'public/js');
mix.options({ runtimeChunkPath: '.' });

// The `manifest.js` file can now be found at `public/manifest.js`
```

### The Manifest File

You might still be confused by that third `manifest.js` file. Webpack compiles with a small bit of run-time code to assist with its job. When not using `mix.extract()`, this code is invisible to you and lives inside your bundle file. However, if we need to split our code, that runtime code must "live" somewhere. As such, Laravel Mix will extract it to its own file.
