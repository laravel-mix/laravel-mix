# CSS Preprocessors \(Sass, Less\)

```js
mix.js('src', 'output')
   .sass('src', 'output')
```

A single method call allows you to compile your Sass \(`mix.sass()`\) or Less \(`mix.less()`\) files, while applying automatic CSS3 prefixing.

Though Webpack can inline all of your CSS directly into the bundled JavaScript, Laravel Mix automatically performs the necessary steps to extract it to your desired output path.

### Multiple Builds

Should you need to compile more than one root Sass or Less file, you may call `mix.sass()` as many as times as is needed. For each call, Webpack will output a new file with the relevant contents.

```js
mix.sass('src/app.scss', 'dist/') // creates 'dist/app.css'
   .sass('src/forum.scss', 'dist/'); // creates 'dist/forum.css'
```

### Example

Let's review a quick example:

**webpack.mix.js**

```js
let mix = require('laravel-mix');

mix.js('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.sass', 'public/css');
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

That's all there is to it!

