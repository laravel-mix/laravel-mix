require('../src/index');

require(Mix.paths.mix());

Mix.dispatch('init', Mix);

module.exports = webpackConfig.build();
