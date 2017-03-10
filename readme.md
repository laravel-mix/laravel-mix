[![Build Status](https://travis-ci.org/rogervila/laravel-mix-stylus.svg?branch=master)](https://travis-ci.org/rogervila/laravel-mix-stylus)
[![Watch Dependencies](https://david-dm.org/rogervila/laravel-mix-stylus.svg)](https://david-dm.org/rogervila/laravel-mix-stylus.svg)
[![CircleCI](https://circleci.com/gh/rogervila/laravel-mix-stylus.svg?style=svg)](https://circleci.com/gh/rogervila/laravel-mix-stylus)

## Introduction

This project is a fork from [the original Laravel Mix](https://github.com/JeffreyWay/laravel-mix).

Laravel Mix provides a clean, fluent API for defining basic Webpack build steps for your Laravel application. Mix supports several common CSS and JavaScript pre-processors.

If you've ever been confused about how to get started with module bundling and asset compilation, you will love Laravel Mix!

## Basic Installation

Require `laravel-mix-stylus` and copy the example config files to your project root.

```shell
mkdir my-app && cd my-app
npm init -y
npm install laravel-mix-stylus --save-dev
cp -r node_modules/laravel-mix-stylus/setup/** ./
```

Add the following scripts on your `package.json` file.

```js
"scripts": {
	"webpack": "cross-env NODE_ENV=development webpack --progress --hide-modules",
	"dev": "cross-env NODE_ENV=development webpack --watch --progress --hide-modules",
	"hmr": "cross-env NODE_ENV=development webpack-dev-server --inline --hot",
	"production": "cross-env NODE_ENV=production webpack --progress --hide-modules"
}
```

Now you can use stylus by adding this code on your `webpack.mix.js` file:

```js
mix.stylus('path/to/app.styl', 'dist');
```


## Documentation

You may review the initial documentation here [on GitHub](https://github.com/JeffreyWay/laravel-mix/tree/master/docs#readme).

## License

Laravel Mix is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Links
- [Github Repository](https://github.com/rogervila/laravel-mix-stylus)
- [Npm Package](https://www.npmjs.com/package/laravel-mix-stylus)
- [Original Laravel Mix Repository](https://github.com/JeffreyWay/laravel-mix)
