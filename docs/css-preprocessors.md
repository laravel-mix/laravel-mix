# CSS Preprocessors \(Sass, Less\)

```js
mix.js('src', 'output')
   .sass('src', 'output')
```

A single method call allows you to compile any Sass \(`mix.sass()`\), Less \(`mix.less()`\), or both!

> Note: Webpack naturally requires some form of JavaScript compilation. You can't use `mix.sass()` without a call to `mix.js()` as well.

Though Webpack can inline all of your CSS directly into the bundled JavaScript, Laravel Elixir automatically performs the necessary steps to extract it to your desired output path.

### Example

Let's review a quick example:

**webpack.elixir.js**

```js
let Elixir = require('laravel-webpacker');


Elixir.mix(function (mix) {
    mix.js('./resources/assets/js/app.js', './public/js/app.js')
       .sass('./resources/assets/sass/app.sass', './public/css/app.css');
});


module.exports = Elixir;
```

**./resources/assets/sass/app.sass**

```sass
$primary: grey

.app
    background: $primary
```

> Tip: For Sass compilation, you may freely use the `.sass` and `.scss` syntax styles.

Compile this down as usual \(`node_modules/.bin/webpack`\), and you'll find a `./public/css/app.css` file that contains:

```css
.app {
  background: grey;
}
```

That's all there is to it!

