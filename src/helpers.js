let collect = require('collect.js');

/**
 * Generic tap function.
 *
 * @param {mixed}    val
 * @param {Function} callback
 */
global.tap = function(val, callback) {
    callback(val);

    return val;
};

/**
 * Add tap to arrays.
 *
 * @param {mixed}    val
 * @param {Function} callback
 */
Object.defineProperty(Array.prototype, 'tap', {
    value: function(callback) {
        if (this.length) {
            callback(this);
        }
        return this;
    }
});
