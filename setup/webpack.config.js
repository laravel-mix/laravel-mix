module.exports = async () => {
    const { assertSupportedNodeVersion } = await import('../src/Engine');

    assertSupportedNodeVersion();

    const config = await import('./webpack.config.mjs');

    return config.default();
};
