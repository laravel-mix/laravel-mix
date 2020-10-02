import webpack from 'webpack';

export function buildConfig() {
    require('../../src/index');

    Mix.dispatch('init');

    return new WebpackConfig().build();
}

export async function compile(config) {
    config = config || buildConfig();

    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                reject({ config, err, stats });
            } else {
                resolve({ config, err, stats });
            }
        });
    });
}

export default { buildConfig, compile };
