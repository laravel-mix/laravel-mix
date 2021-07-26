let JavaScript = require('./JavaScript');

class TypeScript extends JavaScript {
    constructor() {
        super();
        this.options = {};
    }

    /**
     * The API name for the component.
     */
    name() {
        return ['typeScript', 'ts'];
    }

    /**
     * Register the component.
     *
     * @param {*} entry
     * @param {string} output
     * @param {object} options
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
        return [].concat(super.webpackRules(), {
            test: /\.tsx?$/,
            loader: Mix.resolve('ts-loader'),
            exclude: /node_modules/,
            options: Object.assign(
                {},
                // TODO: Maybe move to Vue plugin?
                { appendTsSuffixTo: [/\.vue$/] },
                this.options
            )
        });
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} config
     */
    webpackConfig(config) {
        config.resolve.extensions.push('.ts', '.tsx');
    }
}

module.exports = TypeScript;
