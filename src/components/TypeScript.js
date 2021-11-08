const JavaScript = require('./JavaScript');

class TypeScript extends JavaScript {
    /** @type {Record<string, any>} */
    options = {};

    /**
     * The API name for the component.
     */
    name() {
        return ['typeScript', 'ts'];
    }

    /**
     * Register the component.
     *
     * @param {any} entry
     * @param {string} output
     * @param {Record<string, any>} options
     */
    register(entry, output, options = {}) {
        super.register(entry, output);
        this.options = options;
    }

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['ts-loader', 'typescript'].concat();
    }

    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            ...super.webpackRules(),
            {
                test: /\.tsx?$/,
                loader: this.context.resolve('ts-loader'),
                exclude: /node_modules/,
                options: Object.assign(
                    {},
                    // TODO: Maybe move to Vue plugin?
                    { appendTsSuffixTo: [/\.vue$/] },
                    this.options
                )
            }
        ];
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {import('webpack').Configuration} config
     */
    webpackConfig(config) {
        config.resolve = config.resolve || {};
        config.resolve.extensions = config.resolve.extensions || [];
        config.resolve.extensions.push('.ts', '.tsx');

        return config;
    }
}

module.exports = TypeScript;
