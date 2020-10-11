let { mergeSmart } = require('./MergeSmart');

module.exports = (configA, configB) => {
    return mergeSmart(configA, configB);
};
