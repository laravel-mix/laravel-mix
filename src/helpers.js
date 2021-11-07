/**
 * Generic tap function.
 * @deprecated
 **/
Object.defineProperty(global, 'tap', {
    /**
     * @template T
     * @param {T} val
     * @param {(val: T) => void} callback
     * @returns {T}
     */
    value(val, callback) {
        callback(val);

        return val;
    }
});

/**
 * Add tap to arrays.
 * @deprecated
 **/
if (!Array.prototype.hasOwnProperty('tap')) {
    Object.defineProperty(Array.prototype, 'tap', {
        /**
         * @param {(arr: self) => void} callback
         * @returns {self}
         */
        value(callback) {
            if (this.length) {
                callback(this);
            }

            return this;
        }
    });
}

/**
 * Add wrap to arrays.
 * @deprecated
 **/
if (!Array.hasOwnProperty('wrap')) {
    Object.defineProperty(Array, 'wrap', {
        /**
         * @template T
         * @param {T|T[]} value
         * @returns {T[]}
         */
        value(value) {
            if (Array.isArray(value)) {
                return value;
            }

            return [value];
        }
    });
}

/**
 * Flatten an array.
 * @deprecated
 **/
Object.defineProperty(global, 'flatten', {
    /**
     * @template T
     * @param {T[]} arr
     * @returns {T[]}
     */
    value(arr) {
        // @ts-ignore
        return [].concat.apply([], Object.values(arr));
    }
});
