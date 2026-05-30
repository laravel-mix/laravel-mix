const semver = require('semver');
const pkg = require('../package.json');

module.exports.assertSupportedNodeVersion = function assertSupportedNodeVersion() {
    if (!semver.satisfies(process.versions.node, pkg.engines.node)) {
        throw new Error(
            `You are using an unsupported version of Node (${process.versions.node}). Please update to a version matching "${pkg.engines.node}".`
        );
    }
};
