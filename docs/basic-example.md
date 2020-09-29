# Basic Example

Laravel Mix is a clean layer on top of webpack to make the 80% use case laughably simple to execute. Most would agree that, though incredibly powerful, webpack ships with a steep learning curve. But what if you didn't have to worry about that?

Have a look at a basic Mix configuration file. Let's imagine that we only desire JavaScript and Sass compilation:

```js
let mix = require('laravel-mix');

mix.js('src/app.js', 'dist')
   .sass('src/app.sass', 'dist');
```

Done. Simple, right?

1. Compile the Sass file, `./src/app.sass`, to `./dist/app.css`
2. Bundle all JavaScript at `./src/app.js` to `./dist/app.js`.

With this configuration in place, we may trigger webpack from the command line: `npx mix`.

During development, it's unnecessary to minify the output, however, this will be performed automatically when you trigger webpack within a production environment: `npx mix build --production`.

### Less? Stylus?

But what if you prefer a different CSS framework, like Less or Stylus? No problem. Just swap `mix.sass()` with `mix.less()`, and you're done!

You'll find that most common webpack tasks become a cinch with Laravel Mix.
