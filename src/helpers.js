let objectValues = require('lodash').values;

/**
 * Generic tap function.
 *
 * @param {*}    val
 * @param {Function} callback
 */
global.tap = function (val, callback) {
    callback(val);

    return val;
};

/**
 * Add tap to arrays.
 *
 * @param {*}    val
 * @param {Function} callback
 */
if (!Array.prototype.hasOwnProperty('tap')) {
    Object.defineProperty(Array.prototype, 'tap', {
        value: function (callback) {
            if (this.length) {
                callback(this);
            }

            return this;
        }
    });
}

/**
 * Add wrap to arrays.
 *
 * @param {*}    val
 * @param {Function} callback
 */
if (!Array.hasOwnProperty('wrap')) {
    Object.defineProperty(Array, 'wrap', {
        value(value) {
            if (Array.isArray(value)) {
                return value;
            }

            return [value];
        }
    });
}

/**
 * Flatten the given array.
 *
 * @param {Array} arr
 */
global.flatten = function (arr) {
    return [].concat.apply([], objectValues(arr));
};
