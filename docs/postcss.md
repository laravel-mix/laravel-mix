# PostCSS Preprocessing

-   [Basic Usage](#basic-usage)
-   [Add PostCSS Plugins](#add-postcss-plugins)
    -   [Apply Plugins Globally](#apply-plugins-globally)
    -   [Use a PostCSS Config File](#use-a-postcss-config-file)

### Basic Usage

Imagine that you have the following CSS file that needs to be compiled and piped through a series of PostCSS plugins. In the example below,
we'll need to pull in the `postcss-custom-properties` or `postcss-preset-env` PostCSS plugin.

```css
:root {
    --some-color: red;
}

.example {
    color: var(--some-color);
}
```

> Tip: You can view a list of all available PostCSS plugins [here](https://github.com/postcss/postcss#plugins).

No problem. First, install the PostCSS plugin through npm.

```bash
npm install postcss-custom-properties --save-dev
```

Next, add PostCSS compilation to your `webpack.mix.js` file, like so:

```js
// webpack.mix.js

let mix = require('laravel-mix');

mix.postCss('src/app.css', 'dist');
```

> Tip: `mix.postCss()` and `mix.css()` are aliases. Both commands work for all examples in this section.

### Add PostCSS Plugins

At this point, we're using PostCSS, but we haven't yet instructed Mix to pull in the `postcss-custom-properties` plugin. We can add an array 
of plugins as the third argument to `mix.postCss()`, like so:

```js
// webpack.mix.js

let mix = require('laravel-mix');

mix.postCss('src/app.css', 'dist', [
    require('postcss-custom-properties')
]);
```

#### Apply Plugins Globally

The above example will **exclusively** pipe `src/app.css` through the `postcss-custom-properties` plugin. However, if you're compiling multiple CSS entrypoints, it can be cumbersome to duplicate your PostCSS plugins array for each call.

```js
// webpack.mix.js

let mix = require('laravel-mix');

mix.postCss('src/one.css', 'dist', [
    require('postcss-custom-properties')
]);

mix.postCss('src/two.css', 'dist', [
    require('postcss-custom-properties')
]);

mix.postCss('src/three.css', 'dist', [
    require('postcss-custom-properties')
]);
```

Instead, you can apply your desired PostCSS plugins globally by either using `mix.options()`...

~~~js
mix.postCss('src/one.css', 'dist')
   .postCss('src/two.css', 'dist')
   .postCss('src/three.css', 'dist');

mix.options({
    postCss: [
        require('postcss-custom-properties') 
    ]
});
~~~

...or by creating a `postcss.config.js` file.

#### Use a PostCSS Config File

If you create a `postcss.config.js` file within the root of your project, Mix will automatically detect and import it.

~~~js
// postcss.config.js

module.exports = {
    plugins: [
        require('postcss-preset-env')
    ]
}
~~~

With this adjustment, your `webpack.mix.js` file can return to:

```js
// webpack.mix.js

let mix = require('laravel-mix');

mix.postCss('src/app.css', 'dist');
```

When you're ready, compile your code as usual (`npx mix`), and you'll find a `/dist/app.css` file that contains:

```css
.example {
    color: red;
}
```

Perfect!
