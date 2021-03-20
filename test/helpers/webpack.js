import mockRequire from 'mock-require';
import webpack from 'webpack';
import { mix, Mix } from './mix.js';

export async function buildConfig(shouldInit = true) {
    if (shouldInit) {
        await Mix.init();
    }

    return await Mix.build();
}

export async function compile(config) {
    config = config || (await buildConfig());

    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                reject({ config, err, stats });
            } else if (stats.hasErrors()) {
                const { errors } = stats.toJson({ errors: true });

                reject(new Error(errors.map(error => error.message).join('\n')));
            } else {
                resolve({ config, err, stats });
            }
        });
    });
}

export function setupVueAliases(version) {
    const vueModule = version === 3 ? 'vue3' : 'vue2';
    const vueLoaderModule = version === 3 ? 'vue-loader16' : 'vue-loader15';

    mockRequire('vue', vueModule);
    mockRequire('vue-loader', vueLoaderModule);

    mix.alias({ vue: require.resolve(vueModule) });

    mix.webpackConfig({
        resolveLoader: {
            alias: {
                'vue-loader': vueLoaderModule
            }
        }
    });
}

export default { buildConfig, compile, setupVueAliases };
