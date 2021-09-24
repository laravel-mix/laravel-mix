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
 * Determine if a variable is declared and is different than null
 * Based on PHP isset() Function
 * @see https://www.php.net/manual/en/function.isset.php
 * @see https://www.npmjs.com/package/@filipevoges/isset
 *
 * @param key
 * @return bool
 *
 * @author Filipe Voges <filipe.vogesh@gmail.com>
 * @version 1.0.1
 * @since 2021-09-17
 */
 if (!Object.hasOwnProperty('isset')) {
	Object.prototype.isset = function() {
		if(arguments.length > 2) {
			throw new Error('Too many arguments');
		}
		let obj = arguments[0];
		let keyArgCheck = 1;
		if(Object.hasOwnProperty('global') && typeof this.global === 'undefined') {
			obj = this;
			keyArgCheck = 0;
		}
		if(typeof obj === 'undefined' || obj === null) {
			return false;
		}
		let argCheck = arguments[keyArgCheck];
		if (typeof argCheck !== 'undefined') {
			if (typeof obj[argCheck] === 'undefined' || obj[argCheck] === null) {
				return false;
			}
		}
		return true;
	}
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
