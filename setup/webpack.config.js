module.exports = async () => {
    require('../src/index');
    require(Mix.paths.mix());

    await Mix.dispatch('init', Mix);

    return await webpackConfig.build();
};
