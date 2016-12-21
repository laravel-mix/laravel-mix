# Installation

Though Laravel Elixir is optimized for Laravel usage, it may be used for any type of application.

### Stand-Alone Project

Begin by installing Laravel Elixir through NPM or Yarn, and then copying the example config files to your project root.

```bash
mkdir my-app && cd my-app
npm init -y
npm install laravel-elixir --save-dev
cp -r node_modules/laravel-webpacker/example/** ./
```

You should now have the following directory structure:

* node\_modules/
* package.json
* webpack.config.js
* webpack.elixir.js

Elixir consists of two core components:

* **webpack.elixir.js: **This is your configuration layer on top of Webpack. Most of your time will be spent here.
* **webpack.config.js: **This is the traditional Webpack configuration file. Only advanced users need to visit this file.

Head over to your webpack.elixir.js file:

```js
let Elixir = require('laravel-webpacker');


Elixir.mix(function (mix) {
    mix.js('./src/app.js', './dist/app.js')
       .sass('./src/app.scss', './dist/app.css');
});


module.exports = Elixir;
```

Take note of the source paths, and create the directory structure to match \(or, of course, change them to your preferred structure\). You're all set now. Compile everything down by running `node_modules/.bin/webpack` from the command line. You should now see:

* dist/app.css
* dist/app.js
* dist/elixir.json \(Your asset dump file, which we'll discuss later\).

Nice job! Now get to work on that project.

### Laravel Project

Laravel 5.4 ships with everything you need to get started. Simply:

* Install Laravel
* Run `npm install` 
* Visit your `webpack.elixir.js file`, and get started!

## NPM Scripts

As a tip, consider adding the following NPM scripts to your `package.json` file, to speed up your workflow. Laravel installs will already include this.

```js
"scripts": {
    "dev": "webpack --watch --progress --hide-modules",
    "hmr": "webpack-dev-server --inline --hot",
    "production": "export NODE_ENV=production && webpack --progress --hide-modules"
  }
```

Now, from the command line, you may run `npm run dev` to watch your files for changes, and then recompile.

