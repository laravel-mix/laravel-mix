# Workflow with Laravel

Let's review a general workflow that you can adopt for your own projects, from scratch.

### Step 1: Install Laravel

```bash
laravel new my-app
```

### Step 2: Install Node Dependencies

```bash
npm install
```

### Step 3: Visit `webpack.mix.js`

Think of this file as your home base for all front-end configuration.

```js
let mix = require('laravel-mix');

mix.js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css');
```

By default, we've enabled JavaScript ES2017 + module bundling, as well as Sass compilation.

### Step 4: Compilation

Go ahead and compile these down.

```bash
node_modules/.bin/webpack
```

Alternatively, if you have the NPM script within your `package.json`, you may do:

```bash
npm run dev
```

Once that finishes, you should now see:

* `./public/js/app.js`
* `./public/css/app.css`

Excellent! Next, let's get to work. To watch your JavaScript for changes, run:

```bash
npm run watch
```

Laravel ships with a `./resources/assets/js/components/Example.vue` file. Give it a tweak, and wait for the OS notification, which signals that the compilation has completed. Great!

> Tip: You may also use `mix.browserSync('myapp.test')` to automatically reload the browser when any relevant file in your Laravel app is changed.

### Step 5: Update Your View

Again, Laravel ships with a welcome page. We can use this for our demo. Update it to:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Laravel</title>

        <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    </head>
    <body>
        <div id="app">
            <example></example>
        </div>

        <script src="{{ mix('js/app.js') }}"></script>
    </body>
</html>
```

And reload the page in your browser. Great! It works.
