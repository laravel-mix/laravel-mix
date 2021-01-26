const semver = require('semver');
const pkg = require('../package.json');

module.exports.assertSupportedNodeVersion = function assertSupportedNodeVersion() {
    if (!semver.satisfies(process.versions.node, pkg.engines.node)) {
        throw new Error(
            `You are using an unspported version of Node. Please update to at least Node v12.14`
        );
    }
};
