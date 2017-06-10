# Installation

Though Laravel Mix is optimized for Laravel usage, it may be used for any type of application.

### Laravel Project

Laravel 5.4 ships with everything you need to get started. Simply:

* Install Laravel
* Run `npm install`
* Visit your `webpack.mix.js file`, and get started!

Now, from the command line, you may run `npm run watch` to watch your files for changes, and then recompile.

> Note: You won't find a `webpack.config.js` file in your project root. By default, Laravel defers to the config file from this repo. However, should you need to configure it, you may copy the file to your project root, and then update your `package.json` NPM scripts accordingly: `cp node_modules/laravel-mix/setup/webpack.config.js ./`.


### Stand-Alone Project

Begin by installing Laravel Mix through NPM or Yarn, then create a config file in your project root.

```bash
mkdir my-app && cd my-app
npm init -y
npm install laravel-mix --save-dev
touch webpack.mix.js
```

You should now have the following directory structure:

* `node_modules/`
* `package.json`
* `webpack.mix.js`

Laravel Mix consists of two core components:

* **webpack.mix.js:** This is your configuration layer on top of webpack. Most of your time will be spent here.
* **node_modules/laravel-mix/setup/webpack.config.js:** This is the traditional webpack configuration file. Advanced users may copy this file to the project root to customize it and omit the `--config` parameter from the build scripts below.

Head over to your webpack.mix.js file and insert the following:

```js
let mix = require('laravel-mix');

mix.js('src/app.js', 'dist')
   .sass('src/app.scss', 'dist');
```

Create the directory structure to match \(or, of course, change the contents of webpack.mix.js and set up your preferred structure\). You're all set now. Compile everything down by running `node_modules/.bin/webpack --config node_modules/laravel-mix/setup/webpack.config.js` from the command line. You should now see:

* `dist/app.css`
* `dist/app.js`
* `dist/mix-manifest.json` (Your asset dump file, which we'll discuss later.)

Nice job! Now get to work on that project.

#### NPM Scripts

As a tip, consider adding the following NPM scripts to your `package.json` file, to speed up your workflow. Laravel installs will already include this.

```js
  "scripts": {
    "dev": "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
    "watch": "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --watch --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
    "hot": "cross-env NODE_ENV=development node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --hot --config=node_modules/laravel-mix/setup/webpack.config.js",
    "production": "cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js"
  }
```
