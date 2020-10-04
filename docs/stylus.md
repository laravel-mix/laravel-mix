# Stylus Preprocessing

-   [Basic Usage](#basic-usage)
-   [Plugin Options](#plugin-options)
-   [Multiple Outputs](#multiple-outputs)

### Basic Usage

Here's a quick example to get you started. Imagine that you have the following Stylus file that needs to be compiled to vanilla CSS.

```stylus
// src/app.styl

$primary = grey

.app
    background: $primary
```

No problem. Let's add Stylus compilation to our `webpack.mix.js` file.

```js
// webpack.mix.js
let mix = require('laravel-mix');

mix.stylus('src/app.styl', 'dist');
```

Compile this down as usual \(`npx mix`\), and you'll find a `/dist/app.css` file that contains:

```css
.app {
    background: grey;
}
```

Easy!

### Plugin Options

Behind the scenes, Laravel Mix of course defers to webpack's `stylus-loader` to load and compile your Stylus files.
From time to time, you may need to override the default options that we pass to it. Use the third argument to `mix.stylus()` in these scenarios.

For a full list of supported options, please [refer to the webpack documentation](https://github.com/webpack-contrib/stylus-loader#options) for `stylus-loader`.

Foe example, you may wish to install additional Stylus-specific plugins, such as [Rupture](https://github.com/jescalan/rupture). No problem. Simply install the plugin in question through NPM (`npm install rupture`), and then include it in your `mix.stylus()` call, like so:

```js
mix.stylus('src/app.styl', 'dist', {
    stylusOptions: {
        use: [require('rupture')()]
    }
});
```

Should you wish to take it further and automatically import plugins globally, you may use the `import` option. Here's an example:

```js
mix.stylus('resources/assets/stylus/app.styl', 'public/css', {
    use: [require('rupture')(), require('nib')(), require('jeet')()],
    import: ['~nib/index.styl', '~jeet/jeet.styl']
});
```

### Multiple Outputs

Should you need to compile more than one root file, you may call `mix.stylus()` as many as times as necessary. For each call, webpack will output a new file with the relevant contents.

```js
mix.stylus('src/app.styl', 'dist/') // creates 'dist/app.css'
    .stylus('src/forum.styl', 'dist/'); // creates 'dist/forum.css'
```
