# CSS Preprocessors

```js
mix.sass('src', 'output');
mix.less('src', 'output');
mix.stylus('src', 'output');
```

A single method call allows you to compile your Sass, Less, or Stylus files, while applying automatic CSS3 prefixing.

Though Webpack can inline all of your CSS directly into the bundled JavaScript, Laravel Mix automatically performs the necessary steps to extract it to your desired output path.

### Multiple Builds

Should you need to compile more than one root file, you may call `mix.sass()` (or any of the preprocessor variants) as many as times as is needed. For each call, Webpack will output a new file with the relevant contents.

```js
mix.sass('src/app.scss', 'dist/') // creates 'dist/app.css'
   .sass('src/forum.scss', 'dist/'); // creates 'dist/forum.css'
```

### Example

Let's review a quick example:

**webpack.mix.js**

```js
let mix = require('laravel-mix');

mix.sass('resources/assets/sass/app.sass', 'public/css');
```

**./resources/assets/sass/app.sass**

```sass
$primary: grey

.app
    background: $primary
```

> Tip: For Sass compilation, you may freely use the `.sass` and `.scss` syntax styles.

Compile this down as usual \(`npm run webpack`\), and you'll find a `./public/css/app.css` file that contains:

```css
.app {
  background: grey;
}
```

### Plugin Options

Behind the scenes, Laravel Mix of course defers to Node-Sass, Less, and Stylus to compile your Sass and Less files, respectively. From time to time, you may need to override the default options that we pass to them. You may provide these as the third argument to `mix.sass()`, `mix.less()`, and `mix.stylus()`.

- **Node-Sass Options:** https://github.com/sass/node-sass#options
- **Less Options:** https://github.com/webpack-contrib/less-loader#options```

```js
mix.sass('src', 'destination', { outputStyle: 'nested' });
```

That's all there is to it!

