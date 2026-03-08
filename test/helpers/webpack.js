import { rspack } from '@rspack/core';

/**
 * @param {import('@rspack/core').Configuration | Promise<import('@rspack/core').Configuration>} configOrPromise
 * @returns {Promise<{config: import('@rspack/core').Configuration, err: Error | undefined, stats: import('@rspack/core').Stats | undefined}>}
 */
export async function compile(configOrPromise) {
    const config = await configOrPromise;
    const compiler = rspack(config);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(
                    Object.create(err, {
                        config: { value: config },
                        stats: { value: stats },
                        err: { value: err }
                    })
                );
            } else if (stats && stats.hasErrors()) {
                const { errors } = stats.toJson({ errors: true, errorDetails: true });
                const err = new Error(
                    (errors || [])
                        .map(
                            error =>
                                error.message || error.details || JSON.stringify(error)
                        )
                        .join('\n')
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
