const { assertSupportedNodeVersion } = require('../src/Engine');

module.exports = async () => {
    // @ts-ignore
    process.noDeprecation = true;

    assertSupportedNodeVersion();

    const mix = require('../src/Mix').primary;

    require(mix.paths.mix());

    await mix.installDependencies();
    await mix.init();

    return mix.build();
};
