# Library Code Splitting

## Vendors

```js
mix.js(src, output)
   .extract(['any', 'vendor', 'library']);
```

Bundling all JavaScript into a single files does come with a potential downside: each time you change a minor detail in your application code, you must bust the cache for all users. That means all of your vendor libraries must be re-downloaded and cached. Yikes - not ideal!

One solution is to isolate, or extract, your vendor libraries into their own file.

* **Application Code**: `app.js`
* **Vendor Libraries**: `vendor.js`
* **Manifest \(webpack Runtime\)**: `manifest.js`

```js
mix.extract(['vue', 'jquery']);
```

The `extract` method expects an array of vendor libraries that you wish to extract from your main bundle file. With this adjustment, the source code for both Vue and jQuery will be located in `vendor.js`, rather than `app.js`. Should you, in the future, need to make a small change to your application JavaScript, it will not affect the larger vendor libraries. Those will remain cached, long-term. Nifty!

Once you run webpack to compile your code, you'll find three new files. You may reference these at the bottom of your HTML, per usual.

```html
<script src="/js/manifest.js"></script>
<script src="/js/vendor.js"></script>
<script src="/js/app.js"></script>
```

In effect, we pay a small HTTP request penalty, in exchange for improved long-term caching.

## Custom chunks

However sometimes we want to get our reusable code into separate chunks.
For example we have mutiple files that imports some code like 
```js
import {SomeUtil, AnotherUtil} from '../our-utils';
```
And we don't wanna store code of every util in every generated file.
We can hadle this with CommonsChunksPluign like that

```js
mix
    .js('resources/assets/js/client/*.js', 'assets/client')
    .js('resources/assets/js/admin/file-one.js', 'assets/admin')
    .js('resources/assets/js/admin/file-two.js', 'assets/admin')
    .js('resources/assets/js/admin/file-ignored.js', 'assets/admin')
    // Here we collect all files where output path includes - assets/client
    .chunks('assets/client', {
        name: 'assets/client/common',
        minChunks: 2
    })
    // But here we want to collect only file-one and file-two from assets/admin
    .chunks(/^(?!.*ignored).*\\assets\\admin/, { // Backslashes are used in output paths only for Win32
        name: 'assets/admin/common',
        minChunks: 2
    })
```

###### Signature
```
mix.chunks(
    matchCase: string | RegExp | Array,
    chunkNameOrConfig: string | Object
)
```
> **MatchCase** will match all of your output js files paths and collect them in a chunk.  
> **chunkNameOrConfig** accepts output name(path) or [CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/) config object


### What's That Manifest File?

webpack compiles with a small bit of run-time code, to assist with its job. When not using `mix.extract()`, this code is invisible to you, and lives inside your bundle file. However, if we want to split our code and allow for long-term caching, that runtime code needs to live somewhere. As such, mix will extract it to its own file as well. This way, both your vendor and manifest files can be cached as long as possible.

