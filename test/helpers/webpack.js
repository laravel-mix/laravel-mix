import webpack from 'webpack';

/**
 * @typedef {object} CompileResult
 * @property {import('webpack').Configuration} config The first configuration
 * @property {import('webpack').Configuration[]} configs All built configurations
 * @property {import('webpack').MultiStats | undefined} stats Stats for each build
 * @property {Error | undefined} err Any errors
 */

/**
 * @param {import('webpack').Configuration | import('webpack').Configuration[] | Promise<import('webpack').Configuration | import('webpack').Configuration[]>} configsOrPromise
 * @returns {Promise<CompileResult>}
 */
export async function compile(configsOrPromise) {
    const resolved = await configsOrPromise;
    const configs = Array.isArray(resolved) ? resolved : [resolved];

    const compiler = webpack(configs);

    /**
     *
     * @param {Error | import('webpack').StatsError[]} errors
     * @param {import('webpack').Stats | import('webpack').MultiStats | undefined} stats
     * @returns {Error & {stats: import('webpack').Stats | import('webpack').MultiStats | undefined}}
     */
    function createError(errors, stats) {
        const err = Array.isArray(errors) ? new Error(
            errors.map(error => error.message).join('\n')
        ) : errors;

        return Object.create(err, {
            config: { value: configs[0] },
            configs: { value: configs },
            stats: { value: stats },
            err: { value: err }
        })
    }

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(createError(err, stats))
            } else if (stats && stats.hasErrors()) {
                const { errors } = stats.toJson({ errors: true });

                reject(createError(errors || [], stats))
            } else {
                resolve({ config: configs[0], configs, err, stats });
            }
        });
    });
}
