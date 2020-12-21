require('./helpers');
require('dotenv').config();

let WebpackConfig = require('./builder/WebpackConfig');
let Chunks = require('./Chunks').Chunks;

/**
 * Boot the Mix framework.
 *
 * @returns {typeof import('../types/index')}
 */
module.exports = () => {
    global.Config = require('./config')();
    global.Mix = new (require('./Mix'))();
    global.webpackConfig = new WebpackConfig();

    let ComponentRegistrar = require('./components/ComponentRegistrar');

    Mix.registrar = new ComponentRegistrar();

    return tap(Mix.registrar.installAll(), () => Chunks.reset());
};
