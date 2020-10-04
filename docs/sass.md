# Sass Preprocessing

-   [Basic Usage](#basic-usage)
-   [Plugin Options](#plugin-options)
-   [Multiple Outputs](#multiple-outputs)

### Basic Usage

Here's a quick example to get you started. Imagine that you have the following Sass file that needs to be compiled to vanilla CSS.

```scss
// src/app.scss
$primary: grey;

.app {
    background: $primary;
}
```

No problem. Let's add Sass compilation to our `webpack.mix.js` file.

```js
// webpack.mix.js
let mix = require('laravel-mix');

mix.sass('src/app.scss', 'dist');
```

> Tip: For Sass compilation, you may freely use the `.sass` and `.scss` syntax styles.

Compile this down as usual \(`npx mix`\), and you'll find a `/dist/app.css` file that contains:

```css
.app {
    background: grey;
}
```

Easy!

### Plugin Options

Behind the scenes, Laravel Mix of course defers to webpack's `sass-loader` to load and compile your Sass files.
From time to time, you may need to override the default options that we pass to it. Use the third argument to `mix.sass()` in these scenarios.

```js
mix.sass('src/app.scss', 'dist', {
    sassOptions: {
        outputStyle: 'nested'
    }
});
```

For a full list of supported options, please [refer to the webpack documentation](https://webpack.js.org/loaders/sass-loader/#options) for `sass-loader`.

### Multiple Outputs

Should you need to compile more than one root file, you may call `mix.sass()` as many as times as necessary. For each call, webpack will output a new file with the relevant contents.

```js
mix.sass('src/app.scss', 'dist/') // creates 'dist/app.css'
    .sass('src/forum.scss', 'dist/'); // creates 'dist/forum.css'
```
