# Library Code Splitting

```js
mix.js(src, output).extract();
```

Bundling all JavaScript into a single files does come with a potential downside: each time you change a minor detail in your application code, you must bust the cache for all users. That means all of your vendor libraries must be re-downloaded and cached. Yikes - not ideal!

One solution is to isolate, or extract, your vendor libraries into their own file.

-   **Application Code**: `app.js`
-   **Vendor Libraries**: `vendor.js`
-   **Manifest \(webpack Runtime\)**: `manifest.js`

```js
mix.extract();

// Or:
mix.extract(['vue', 'jquery']);
```

If you don't provide an array of npm libraries to the `extract` method, Mix will extract all imported libraries from the node_modules directory. This is a useful default, and is likely what you want. However, if you need to be explicit, pass an array and only those vendor libraries will be extracted.

Once you run webpack to compile your code, you'll find three new files. You may reference these at the bottom of your HTML.

```html
<script src="/js/manifest.js"></script>
<script src="/js/vendor.js"></script>
<script src="/js/app.js"></script>
```

In effect, we pay a small HTTP request penalty, in exchange for improved long-term caching of vendor code that very rarely will change.

### What's That Manifest File?

webpack compiles with a small bit of run-time code, to assist with its job. When not using `mix.extract()`, this code is invisible to you, and lives inside your bundle file. However, if we want to split our code and allow for long-term caching, that runtime code needs to live somewhere. As such, mix will extract it to its own file as well. This way, both your vendor and manifest files can be cached as long as possible.
