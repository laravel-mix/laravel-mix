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

let mix = require('./bootstrap')();

if (Mix.sees('laravel')) {
    Config.publicPath = 'public';
}

Mix.listen('init', () => require('./HotReloading').record());

module.exports = tap(mix, mix => {
    // Legacy.
    mix.inProduction = () => Config.production;
});
