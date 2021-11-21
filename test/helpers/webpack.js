import webpack from 'webpack';

import { Mix } from './mix.js';

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
                reject(
                    Object.create(err, {
                        config: { value: config },
                        stats: { value: stats },
                        err: { value: err }
                    })
                );
            } else if (stats && stats.hasErrors()) {
                const { errors } = stats.toJson({ errors: true });
                const err = new Error(
                    (errors || []).map(error => error.message).join('\n')
                );

                reject(
                    Object.create(err, {
                        config: { value: config },
                        stats: { value: stats },
                        err: { value: err }
                    })
                );
            } else {
                resolve({ config, err, stats });
            }
        });
    });
}

export default { buildConfig, compile };
