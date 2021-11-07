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

if (!global.Mix) {
    throw new Error(
        'Importing / requiring laravel-mix should only happen when building your code.'
    );
}

// TODO: Remove in next major version — none of these are used by mix itself
require('./helpers');

// Allow CJS: const mix = import('laravel-mix')
module.exports = global.Mix.api;

// Allow ESM: import mix from 'laravel-mix'
module.exports.default = global.Mix.api;
