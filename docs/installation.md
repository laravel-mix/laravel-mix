# Installation

Though Laravel Mix is optimized for Laravel usage, it may be used for any type of application.

### Stand-Alone Project

Begin by installing Laravel Mix through NPM or Yarn, and then copying the example config files to your project root.

```bash
mkdir my-app && cd my-app
npm init -y
npm install laravel-mix --save-dev
cp -r node_modules/laravel-mix/setup/** ./
```

You should now have the following directory structure:

* node\_modules/
* package.json
* webpack.config.js
* webpack.mix.js

Laravel Mix consists of two core components:

* **webpack.mix.js: **This is your configuration layer on top of Webpack. Most of your time will be spent here.
* **webpack.config.js: **This is the traditional Webpack configuration file. Only advanced users need to visit this file.

Head over to your webpack.mix.js file:

```js
let mix = require('laravel-mix').mix;

mix.js('src/app.js', 'dist')
   .sass('src/app.scss', 'dist');
```

Take note of the source paths, and create the directory structure to match \(or, of course, change them to your preferred structure\). You're all set now. Compile everything down by running `node_modules/.bin/webpack` from the command line. You should now see:

* dist/app.css
* dist/app.js
* dist/mix.json \(Your asset dump file, which we'll discuss later\).

Nice job! Now get to work on that project.


#### NPM Scripts

As a tip, consider adding the following NPM scripts to your `package.json` file, to speed up your workflow. Laravel installs will already include this.

```js
  "scripts": {
    "webpack": "cross-env NODE_ENV=development webpack --progress --hide-modules",
    "dev": "cross-env NODE_ENV=development webpack --watch --progress --hide-modules",
    "hmr": "cross-env NODE_ENV=development webpack-dev-server --inline --hot",
    "production": "cross-env NODE_ENV=production webpack --progress --hide-modules"
  }
```

### Laravel Project

Laravel 5.4 ships with everything you need to get started. Simply:

* Install Laravel
* Run `npm install` 
* Visit your `webpack.mix.js file`, and get started!

Now, from the command line, you may run `npm run dev` to watch your files for changes, and then recompile.

