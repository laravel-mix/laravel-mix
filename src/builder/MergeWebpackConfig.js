let { mergeSmart } = require('./MergeSmart');

/** @typedef {import('webpack').Configuration} Configuration */

/**
 *
 * @param {Configuration} configA
 * @param {Configuration} configB
 */
module.exports = (configA, configB) => {
    return mergeSmart(configA, configB);
};
