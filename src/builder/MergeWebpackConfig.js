let webpackMerge = require('webpack-merge');
let { mergeSmart } = require('./MergeSmart');

let hasWarned = false;

module.exports = (configA, configB, shouldWarn = false) => {
    if (!hasWarned && shouldWarn) {
        hasWarned = true;

        console.warn(
            'The behavior of automatic webpack merging of rules will change with Laravel Mix 7.0.'
        );
    }

    return mergeSmart(configA, configB);
};
