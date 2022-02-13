const { assertSupportedNodeVersion } = require('../src/Engine');

module.exports = async () => {
    assertSupportedNodeVersion();

    const config = await import('./webpack.config.mjs');

    return await config.default();
};
