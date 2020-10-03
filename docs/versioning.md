# Versioning

-   [Basic Usage](#basic-usage.md)
-   [Importing Versioned Files](#importing-versioned-files.md)

### Basic Usage

To assist with long-term caching, Laravel Mix provides the `mix.version()` method to enable file hashing, such as `app.js?id=8e5c48eadbfdd5458ec6`. This is useful for cache-busting purposes.

```js
// 1. Version all compiled assets.
mix.version();

// 2. Version compiled assets AND public/js/file.js
mix.version(['public/js/file.js']);
```

Imagine that your server automatically caches scripts for one year to improve performance. That's great, but each time you make a change to your application code, you need some way to instruct the server to bust the cache. This is typically done through the use of query strings or file hashing.

With Mix versioning enabled, a unique querystring id will be appended to your assets every time your code is compiled. Consider the following `webpack.mix.js` file.

```js
let mix = require('laravel-mix');

mix.js('src/app.js', 'dist/js')
    .sass('src/app.sass', 'dist/css')
    .version();
```

Upon compilation, you'll see `/css/app.css?id=5ee7141a759a5fb7377a` and `/js/app.js?id=0441ad4f65d54589aea5` in your `mix-manifest.json` file. Of course, your particular hash will be different. Each time you adjust your JavaScript, the compiled files will receive a newly hashed name, which will effectively bust the cache once pushed to production.

If you'd like to test it, run `npx mix watch` and then change a bit of your JavaScript. Return to `mix-manifest.json` and you'll notice that, for each change, the unique hash changes.

### Importing Versioned Files

This all begs the question: in our HTML file, how can we make the name of the script and stylesheet dynamic, based on their respective values within the `mix-manifest.json` file? Yes, that can be tricky.

The answer will be dependent upon the type of application you're building. For SPAs, you may dynamically read Laravel Mix's generated `mix-manifest.json` file, extract the asset file names, and then generate your HTML.

#### Laravel Users

For Laravel projects, a solution is provided out of the box. Simply call its global `mix()` function, and you're done! Here's a quick example:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>App</title>
        <link rel="stylesheet" href="/css/app.css?id=5ee7141a759a5fb7377a" />
    </head>

    <body>
        <div id="app"><h1>Hello World</h1></div>

        <script src="/js/app.js?id=0441ad4f65d54589aea5"></script>
    </body>
</html>
```

Pass the unhashed version of your desired file path to the `mix()` function, and, behind the scenes, Laravel will read `mix-manifest.json` and grab its hashed equivalent. In the example above,
you'll ultimately end up with something resembling:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>App</title>
        <link rel="stylesheet" href="{{ mix('css/app.css') }}" />
    </head>

    <body>
        <div id="app"><h1>Hello World</h1></div>

        <script src="{{ mix('js/app.js') }}"></script>
    </body>
</html>
```
