# General CSS Compilation

-   [Basic Usage](#basic-usage)
-   [Advanced Usage](#advanced-usage)

### Basic Usage

Mix provides the `mix.css()` command for basic CSS compilation. Here's an example that imports the Normalize CSS library and adds a single rule.

```css
/* src/app.css */

@import '~normalize.css/normalize.css';

body {
    color: red;
}
```

We can now add CSS compilation to our `webpack.mix.js` file, like so:

```js
// webpack.mix.js
let mix = require('laravel-mix');

mix.css('src/app.css', 'dist');
```

Run webpack with `npx mix` and you'll find a `/dist/app.css` file that contains the full Normalize library, as well as your `body` rule.

Easy!

### Advanced Usage

As you'll find in the next section, `mix.css()` is an alias for `mix.postCss()`. This means you have full access to the entire PostCSS plugin ecosystem as part of your compilation.

