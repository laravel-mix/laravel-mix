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
            // Release rspack's resources (thread pool, cache, watchers) so the
            // AVA worker can exit cleanly — AVA 6 fails the run otherwise.
            compiler.close(() => {
                if (err) {
                    // Attach context as own properties without wrapping the
                    // error in a non-native object — AVA 6's t.throwsAsync
                    // rejects values that aren't real Error instances.
                    reject(
                        Object.defineProperties(err, {
                            config: { value: config },
                            stats: { value: stats }
                        })
                    );
                } else if (stats && stats.hasErrors()) {
                    const { errors } = stats.toJson({
                        errors: true,
                        errorDetails: true
                    });
                    const buildError = new Error(
                        (errors || [])
                            .map(
                                error =>
                                    error.message ||
                                    error.details ||
                                    JSON.stringify(error)
                            )
                            .join('\n')
                    );

                    reject(
                        Object.defineProperties(buildError, {
                            config: { value: config },
                            stats: { value: stats }
                        })
                    );
                } else {
                    resolve({ config, err, stats });
                }
            });
        });
    });
}
