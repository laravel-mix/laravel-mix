module.exports = async env => {
    if (process.env) {
        process.env.MIX_FILE = process.env.MIX_FILE || env.MIX_FILE;
        process.env.NODE_ENV = process.env.NODE_ENV || env.NODE_ENV;
    }

    require('../src/index');
    require(Mix.paths.mix());

    await Mix.dispatch('init', Mix);

    return await webpackConfig.build();
};
