require('../src/index');

require(Mix.paths.mix());

module.exports = (async () => {
    await Mix.dispatch('init', Mix);

    return webpackConfig.build();
})();
