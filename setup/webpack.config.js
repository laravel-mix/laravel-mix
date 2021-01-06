module.exports = async () => {
    const mix = require('../src/Mix').primary;

    require(mix.paths.mix());

    await mix.installDependencies();
    await mix.init();

    return mix.build();
};
