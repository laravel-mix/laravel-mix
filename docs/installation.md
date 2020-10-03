# Installation

-   [Stand-Alone Projects](#stand-alone-projects)
-   [Laravel Projects](#laravel-projects)

Though Laravel Mix was originally built for Laravel projects, it of course may be used for any type of application.

## Stand-Alone Projects

### Step 1. Install Mix

Begin by installing Laravel Mix through NPM or Yarn.

```bash
mkdir my-app && cd my-app
npm init -y
npm install laravel-mix --save-dev
```

### Step 2. Create a Mix Configuration File

Next, create a Mix configuration file within the root of your new project.

```
touch webpack.mix.js
```

You should now have the following directory structure:

-   `node_modules/`
-   `package.json`
-   `webpack.mix.js`

`webpack.mix.js` is your configuration layer on top of webpack. Most of your time will be spent here.

### Step 3. Define Your Compilation

Open `webpack.mix.js` and add the following code:

```js
// webpack.mix.js

let mix = require('laravel-mix');

mix.js('src/app.js', 'dist').setPublicPath('dist');
```

At its core, Mix is an opinionated, fluent API on top of webpack. In the example above, we've instructed Mix to compile `src/app.js` and save it to the `dist/` directory. If you're working along, create `src/app.js` now, and populate it with a simple alert:

```js
// src/app.js
alert('hello world');
```

Of course this is only a placeholder for your actual JavaScript code.

### Step 4. Compile

We're now ready to bundle up our assets. Mix provides a command-line program called `mix` which triggers the appropriate webpack build. Give it a run now.

```
npx mix
```

Congrats! You've created your first bundle. Create an HTML file, load your script, and you'll see an alert when the page loads.

## Laravel Projects

Laravel ships with everything you need to get started. Simply:

-   Install Laravel (`laravel new app`)
-   Run `npm install`
-   Visit your `webpack.mix.js file`, and get started!
