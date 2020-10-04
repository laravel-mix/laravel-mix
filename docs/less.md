# Less Preprocessing

-   [Basic Usage](#basic-usage)
-   [Plugin Options](#plugin-options)
-   [Multiple Outputs](#multiple-outputs)

### Basic Usage

Here's a quick example to get you started. Imagine that you have the following Less file that needs to be compiled to vanilla CSS.

```scss
// src/app.scss
@primary: grey;

.app {
    background: @primary;
}
```

No problem. Let's add Less compilation to our `webpack.mix.js` file.

```js
// webpack.mix.js
let mix = require('laravel-mix');

mix.less('src/app.less', 'dist');
```

Compile this down as usual \(`npx mix`\), and you'll find a `/dist/app.css` file that contains:

```css
.app {
    background: grey;
}
```

Easy!

### Plugin Options

Behind the scenes, Laravel Mix of course defers to webpack's `less-loader` to load and compile your Less files.
From time to time, you may need to override the default options that we pass to it. Use the third argument to `mix.less()` in these scenarios.

```js
mix.less('src/app.less', 'dist', {
    lessOptions: {
        strictMath: true
    }
});
```

For a full list of supported options, please [refer to the webpack documentation](https://webpack.js.org/loaders/less-loader/#options) for `less-loader`.

### Multiple Outputs

Should you need to compile more than one root file, you may call `mix.less()` as many as times as necessary. For each call, webpack will output a new file with the relevant contents.

```js
mix.less('src/app.less', 'dist/') // creates 'dist/app.css'
    .less('src/forum.less', 'dist/'); // creates 'dist/forum.css'
```
