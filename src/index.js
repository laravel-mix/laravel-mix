const Mix = require('./Mix');

require('./helpers');

/*
 |--------------------------------------------------------------------------
 | Welcome to Laravel Mix!
 |--------------------------------------------------------------------------
 |
 | Laravel Mix provides a clean, fluent API for defining basic webpack
 | build steps for your Laravel application. Mix supports a variety
 | of common CSS and JavaScript pre-processors out of the box.
 |
 */

let mix = Mix.primary;

mix.boot();

module.exports = mix.api;
