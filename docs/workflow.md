# Basic Laravel Workflow

Let's review a general workflow that you might adopt for your own projects.

### Step 1: Install Laravel

```bash
laravel new my-app
```

### Step 2: Install Node Dependencies

By default, Laravel ships with Laravel Mix as a dependency. This means you can immediately install your Node dependencies.

```bash
npm install
```

### Step 3: Visit `webpack.mix.js`

Think of this file as your home base for all front-end configuration.

```js
let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'js').sass('resources/sass/app.scss', 'css');
```

Using the code above, we've requested JavaScript ES2017 + module bundling, as well as Sass compilation.

### Step 4: Compilation

If those files don't exist in your project, go ahead and create them. Populate `app.js` with a basic alert, and `app.scss` with any random color on the body tag.

```js
// resources/js/app.js

alert('Hello World');
```

```scss
// resources/sass/app.scss
$primary: red;

body {
    color: $primary;
}
```

When you're ready, let's compile.

```bash
npx mix
```

You should now see two new files within your project's `public` directory.

-   `./public/js/app.js`
-   `./public/css/app.css`

Excellent! Next, let's get into a groove. It's a pain to re-run `npx mix` every time you change a file. Instead, let's have Mix (and ultimately webpack) watch these files for changes.

```bash
npx mix watch
```

Perfect. Make a minor change to `resources/js/app.js` and webpack will automatically recompile.

> Tip: You may also use `mix.browserSync('myapp.test')` to automatically reload the browser when any relevant file in your Laravel app is changed.

### Step 5: Update Your View

Laravel ships with a static welcome page. Let's use this for our demo. Update it to:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Laravel</title>

        <link rel="stylesheet" href="/css/app.css" />
    </head>
    <body>
        <h1>Hello World</h1>

        <script src="/js/app.js"></script>
    </body>
</html>
```

Run your Laravel app. It works!
