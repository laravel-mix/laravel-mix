const { assertSupportedNodeVersion } = require('../src/Engine');
const Mix = require('../src/Mix');

module.exports = async () => {
    // @ts-ignore
    process.noDeprecation = true;

    assertSupportedNodeVersion();

    const mix = Mix.primary;

    // Boot mix
    await mix.boot();

    // Load the user's mix config
    await mix.load();

    // Install any missing dependencies
    await mix.installDependencies();

    // Start running
    await mix.init();

    // Turn everything into a config
    return await mix.build();
};
