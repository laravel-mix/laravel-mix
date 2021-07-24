import webpack from 'webpack';

import { mix, Mix } from './mix.js';

/**
 *
 * @param {*} shouldInit
 * @returns {Promise<import('webpack').Configuration>}
 */
export async function buildConfig(shouldInit = true) {
    if (shouldInit) {
        await Mix.init();
    }

    return await Mix.build();
}

/**
 *
 * @param {import('webpack').Configuration} [override]
 * @returns {Promise<{config: import('webpack').Configuration, err: Error | undefined, stats: import('webpack').Stats | undefined}>}
 */
export async function compile(override) {
    const config = override || (await buildConfig());

    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                reject({ config, err, stats });
            } else if (stats && stats.hasErrors()) {
                const { errors } = stats.toJson({ errors: true });

                reject({
                    config,
                    err: new Error((errors || []).map(error => error.message).join('\n')),
                    stats
                });
            } else {
                resolve({ config, err, stats });
            }
        });
    });
}

/**
 *
 * @param {string|number} version
 */
export function setupVueAliases(version) {
    const vueModule = version === 3 ? 'vue3' : 'vue2';
    const vueLoaderModule = version === 3 ? 'vue-loader16' : 'vue-loader15';

    Mix.resolver.alias('vue', vueModule);
    Mix.resolver.alias('vue-loader', vueLoaderModule);

    mix.alias({ vue: require.resolve(vueModule) });
}

export default { buildConfig, compile, setupVueAliases };
