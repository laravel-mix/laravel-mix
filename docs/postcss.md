# PostCss Preprocessing

-   [Basic Usage](#basic-usage)
-   [Autoprefixer](#autoprefixer)
-   [Global Plugin Options](#global-plugin-options)

### Basic Usage

Here's a quick example to get you started. Imagine that you have the following CSS file that needs to be compiled and piped through a series of PostCSS plugins. In the example below,
we'll need to pull in the `postcss-custom-properties` PostCss plugin.

```css
:root {
    --some-color: red;
}

.example {
    color: var(--some-color);
}
```

No problem. Let's add PostCss compilation to our `webpack.mix.js` file.

```js
// webpack.mix.js

let mix = require('laravel-mix');

mix.postCss('src/app.css', 'dist', [require('postcss-custom-properties')]);
```

Notice how, as the third argument to `mix.postCss()`, we can provide an optional array of PostCSS plugins that should be included as part of the build.

Compile this down as usual \(`npx mix`\), and you'll find a `/dist/app.css` file that contains:

```css
.example {
    color: red;
}
```

Perfect!

### Autoprefixer

By default, Mix will pipe all of your CSS through the popular [Autoprefixer PostCSS plugin](https://github.com/postcss/autoprefixer). As such, you are free to use the latest CSS 3 syntax with the understanding that we'll apply any necessary browser-prefixes automatically.
The default settings should be fine in most scenarios, however, if you need to tweak the underlying Autoprefixer configuration, here's how:

```js
mix.postCss('src/app.css', 'dist').options({
    autoprefixer: {
        options: {
            browsers: ['last 6 versions']
        }
    }
});
```

Additionally, if you wish to disable it entirely, set `autoprefixer` to `false`.

```js
mix.postCss('src/app.css', 'dist').options({
    autoprefixer: false
});
```
