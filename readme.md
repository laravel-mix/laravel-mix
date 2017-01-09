[![Build Status](https://travis-ci.org/rogervila/laravel-mix-stylus.svg?branch=master)](https://travis-ci.org/rogervila/laravel-mix-stylus)
[![Watch Dependencies](https://david-dm.org/rogervila/laravel-mix-stylus.svg)](https://david-dm.org/rogervila/laravel-mix-stylus.svg)

This project is a fork from [the original Laravel Mix](https://github.com/JeffreyWay/laravel-mix).

You may review the original documentation here [on GitHub](https://github.com/JeffreyWay/laravel-mix/tree/master/docs).

## Links
[Github Repository](https://github.com/rogervila/laravel-mix-stylus)
[Npm Package](https://www.npmjs.com/package/laravel-mix-stylus)

## Basic Installation

```shell
mkdir my-app && cd my-app
npm init -y
npm install laravel-mix-stylus --save-dev
cp -r node_modules/laravel-mix-stylus/setup/** ./
```

## Example

**This fork supports less and sass too**, but it adds Stylus support. 

```js
mix.stylus('path/to/app.styl', 'dist');
```

## License

Laravel Mix is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
