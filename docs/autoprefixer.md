# Autoprefixer

- [Basic Usage](#basic-usage)
- [Set Custom Autoprefixer Options](#set-custom-autoprefixer-options)
- [Disable Autoprefixer](#disable-autoprefixer)

By default, Mix will pipe all of your CSS through the popular [Autoprefixer PostCSS plugin](https://github.com/postcss/autoprefixer). As such, you are free to use the latest CSS 3 syntax with the understanding that we'll apply any necessary browser-prefixes automatically.

### Basic Usage

Assuming your CSS entry file is:

```css
/* src/app.css */

@keyframes foo {
   to {
       background: red;
   }
}

#selector {
    animation: foo 2s;
}
```

If you add CSS compilation to your `webpack.mix.js` file...


```js
// webpack.mix.js

mix.css('src/app.css', 'dist');
```

The generated output file will automatically add any necessary CSS browser-prefixes, based on the latest global browser usage statistics.

```css
/* dist/app.css */

@-webkit-keyframes foo {
   to {
       background: red;
   }
}

@keyframes foo {
   to {
       background: red;
   }
}

#selector {
    -webkit-animation: foo 2s;
            animation: foo 2s;
}

```

### Set Custom Autoprefixer Options

The default settings should be fine in most scenarios, however, if you need to tweak the underlying 
Autoprefixer configuration, reach for `mix.options()`.

```js
mix.postCss('src/app.css', 'dist')
   .options({
       autoprefixer: { remove: false } 
   });
```

### Disable Autoprefixer 

If you instead wish to disable autoprefixing entirely, set `autoprefixer` to `false`.

```js
// Using Sass
mix.sass('src/app.css', 'dist')
   .options({
      postCss: [
         require('autoprefixer')({
            remove: false,
         })
      ]
   })
   
// Using postCss directly
mix.postCss('src/app.css', 'dist')
   .options({ autoprefixer: false });
```

All underlying Autoprefixer options [may be reviewed here](https://github.com/postcss/autoprefixer#options).
