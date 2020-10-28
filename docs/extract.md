# Code Splitting

-   [Basic Usage](#basic-usage)
-   [Customize the Runtime Chunk Path](#customize-the-runtime-chunk-path)
-   [The Manifest File](#the-manifest-file)
-   [Multiple Extractions](#multiple-extractions)
-   [Fallback Extractions](#fallback-extractions)
-   [Extractions Using Regular Expressions](#extractions-using-regular-expressions)
-   [Custom Extraction Tests](#custom-extraction-tests)
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

// 2. Only extract the Vue and jQuery libraries (if used) into a vendor.js file.
mix.extract(['vue', 'jquery']);

// 3. Extract Vue and jQuery (if used) to custom-vendor-name.js.
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

### Customize the Runtime Chunk Path

By default, the runtime chunk (`manifest.js`) is generated next to your JS assets.

However, the path can easily be customized, relative to the public path:

```js
mix.options({ runtimeChunkPath: 'custom' });

// The `manifest.js` file will now be saved to `public/custom/manifest.js`
```

If you instead prefer the public path, use `.`.

```js
mix.js('resources/app.js', 'public/js');
mix.options({ runtimeChunkPath: '.' });

// The `manifest.js` file will now be saved to `public/manifest.js`
```

### Multiple Extractions

You may call `mix.extract(['library1', 'library2'])` multiple times with different arguments to extract different sets of libraries into separate files.

```js
mix.extract(['vue', 'lodash-es'], 'vendor~utils-1.js');
mix.extract(['jquery', 'axios'], 'vendor~utils-2.js');

// `vendor~utils-1.js` will contain Vue and Lodash
// `vendor~utils-2.js` will contain jQuery and Axios
```

### Fallback Extractions

A call to `mix.extract()` may be paired with one or more calls to `mix.extract(['library1', 'library2'], 'file.js')` and all libraries not extracted into specific files will be saved to `vendor.js`.

```js
mix.extract(['vue', 'lodash-es'], 'vendor~utils-1.js');
mix.extract(['jquery', 'axios'], 'vendor~utils-2.js');
mix.extract();

// `vendor~utils-1.js` will contain Vue and Lodash
// `vendor~utils-2.js` will contain jQuery and Axios
// `vendor.js` will contain all other used libraries from node_modules
```

#### Extractions Using Regular Expressions

It is now possible to match libraries by a regular expression. This is useful for libraries split into many modules/packages, like D3. To leverage this feature, pass an object to `mix.extract()`.

```js
mix.extract({
  // If you don't specify a location, it defaults to `vendor.js`
  to: 'js/vendor-d3.js',

  // This can be an array of strings or a regular expression
  libraries: /d3|d3-[a-z0-9-]+/
});
```

#### Custom Extraction Tests

If you require more control over how modules are extracted, include a `test` function that receives the webpack module object and returns a boolean.

```js
mix.extract({
  to: 'js/vendor-core-js.js',
  test(mod) {
    return /core-js/.test(mod.nameForCondition());
  }
});
```

### The Manifest File

You might still be confused by that third `manifest.js` file. Webpack compiles with a small bit of run-time code to assist with its job. When not using `mix.extract()`, this code is invisible to you and lives inside your bundle file. However, if we need to split our code, that runtime code must "live" somewhere. As such, Laravel Mix will extract it to its own file.
