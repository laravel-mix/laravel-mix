[![Build Status](https://travis-ci.org/rogervila/laravel-mix-stylus.svg?branch=master)](https://travis-ci.org/rogervila/laravel-mix-stylus)
[![Watch Dependencies](https://david-dm.org/rogervila/laravel-mix-stylus.svg)](https://david-dm.org/rogervila/laravel-mix-stylus.svg)

This project is a fork from [the original Laravel Mix](https://github.com/JeffreyWay/laravel-mix).

You may review the original documentation here [on GitHub](https://github.com/JeffreyWay/laravel-mix/tree/master/docs).

## Links
- [Github Repository](https://github.com/rogervila/laravel-mix-stylus)
- [Npm Package](https://www.npmjs.com/package/laravel-mix-stylus)

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

Take a look at [the original installation instructions](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/installation.md).

## Example

This fork is a clone from the original Laravel Mix project, but it adds Stylus support. 

```js
mix.stylus('path/to/app.styl', 'dist');
```

## License

[The original Laravel Mix](https://github.com/JeffreyWay/laravel-mix) is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
