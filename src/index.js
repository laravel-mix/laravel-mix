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


/**
 * We'll begin by pulling in a few globals that Mix often uses.
 */

require('./helpers');

global.path = require('path');
global.File = require('./File');


/**
 * This config object is what Mix will reference, when it's time
 * to dynamically build up your Webpack configuration object.
 */

global.Config = require('./config')();

global.Mix = new (require('./Mix'))();


/**
 * Mix exposes a simple, fluent API for activating many common build
 * steps that a typical project should require. Behind the scenes,
 * all calls to this fluent API will update the above config.
 */

let Api = require('./Api');
let api = new Api();

module.exports = api;
module.exports.config = Mix.config;
