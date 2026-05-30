# Laravel Rix

<p align="center">
<a href="https://www.npmjs.com/package/laravel-rix"><img src="https://img.shields.io/node/v/laravel-rix.svg" alt="Node"></a>
<a href="https://www.npmjs.com/package/laravel-rix"><img src="https://img.shields.io/npm/v/laravel-rix.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/laravel-rix"><img src="https://img.shields.io/npm/l/laravel-rix.svg" alt="License"></a>
</p>

## Introduction

Laravel Rix provides a clean, fluent API for defining asset build steps for your
applications, powered by [Rspack](https://rspack.rs). It supports the common CSS
and JavaScript pre-processors out of the box and aims to be a fast, drop-in
successor to the webpack-based [Laravel Mix](https://github.com/laravel-mix/laravel-mix).

The power of Rspack, distilled for the rest of us.

### Highlights

- **Rspack 2.0** under the hood instead of webpack — significantly faster builds.
- **oxc** as an optional, near-instant replacement for Babel (`mix.oxc()`).
- **LightningCSS** for vendor prefixing and CSS minification.
- The familiar Mix fluent API — `mix.js()`, `mix.sass()`, `mix.vue()`, etc.

## Requirements

- **Node.js >= 24**

## Installation

```bash
npm install --save-dev laravel-rix
```

Your `webpack.mix.js` and the `mix` CLI command work as before — only the
import changes:

```js
const mix = require('laravel-rix');

mix.js('resources/js/app.js', 'public/js')
    .vue({ version: 2 })
    .sass('resources/sass/app.scss', 'public/css')
    .version();
```

## Documentation

This project is a fork of Laravel Mix; the original
[Laravel Mix documentation](https://laravel-mix.com) remains a useful reference
for the shared fluent API. Rix-specific differences (Rspack, oxc, LightningCSS)
are noted in this repository.

## License

Laravel Rix is open-sourced software licensed under the
[MIT license](http://opensource.org/licenses/MIT). It is a fork of
[Laravel Mix](https://github.com/laravel-mix/laravel-mix) by Jeffrey Way.
