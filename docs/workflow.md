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

mix.js('resources/assets/js/app.js', 'public/js');
mix.sass('resources/assets/sass/app.scss', 'public/css');
```

By default, we've enabled JavaScript ES2015 + module bundling, as well as Sass compilation.

### Step 4: Compilation

Go ahead and compile these down.

```bash
node_modules/.bin/webpack
```

Alternatively, if you have the NPM script within your `package.json`, you may do:

```bash
npm run webpack
```

Once that finishes, you should now see:

* `./public/js/app.js`
* `./public/css/app.css`

Excellent! Next, let's get to work. To watch your JavaScript for changes, run:

```bash
npm run dev
```

Laravel ships with a `./resources/assets/js/components/Example.vue` file. Give it a tweak, and wait for the OS notification, which signals that the compilation has completed. Great!

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

### Step 6: Hot Reloading

It would be nice if we could update a Vue component, and instantly see it refresh in the browser, without having to perform a manual refresh. Even better, it would be nice if this refresh didn't reset our component's state. Well, hot module replacement to the rescue!

Return to the command line, and hit `Ctrl+c` to cancel the Webpack watcher. Instead, we'll run:

```bash
npm run hmr
```

"HMR" stands for "hot module replacement." This command is the only thing you have to do to activate automatic reloading. Return to your browser, give it a refresh, and then return to your editor to modify the `./resources/assets/js/components/Example.vue` file. Change the template however you wish, and watch as the browser instantly refreshes to reflect your change \(once you hit save, of course\). Amazing!



