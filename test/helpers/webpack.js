import webpack from 'webpack';

/**
 * @param {import('webpack').Configuration | Promise<import('webpack').Configuration>} configOrPromise
 * @returns {Promise<{config: import('webpack').Configuration, err: Error | undefined, stats: import('webpack').Stats | undefined}>}
 */
export async function compile(configOrPromise) {
    const config = await configOrPromise;
    const compiler = webpack(config);

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
