/**
 * Generic tap function.
 *
 * @param {mixed}    val
 * @param {Function} callback
 */
global.tap = function (val, callback) {
    callback(val);

    return val;
};
