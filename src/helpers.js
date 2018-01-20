let objectValues = require('lodash').values;

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


/**
 * Flatten the given array.
 *
 * @param {Array} arr
 */
global.flatten = function (arr) {
    return [].concat.apply(
        [], objectValues(arr)
    );
};

/**
 * Sort object by keys
 *
 * @param {Object} obj
 */
global.sortObjectKeys = (obj) => {
    return Object.keys(obj).sort()
        .reduce((r, k) => (r[k] = obj[k], r), {});
};
