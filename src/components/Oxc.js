const { Component } = require('./Component');

module.exports = class Oxc extends Component {
    /** @type {Record<string, any>} */
    options = {};

    passive = false;

    /**
     * The API name for the component.
     */
    name() {
        return ['oxc'];
    }

    /**
     * Register the component.
     *
     * @param {Record<string, any>} options
     */
    register(options = {}) {
        this.options = options;
    }

    /**
     * Build the oxc-transform options, auto-detecting React/Preact
     * and merging with user-provided options.
     */
    buildOptions() {
        const defaults = { target: 'es2015' };

        // Auto-detect React — equivalent of @babel/preset-react
        if (!this.options.jsx && this.context.components.has('react')) {
            defaults.jsx = { runtime: 'automatic' };
        }

        // Auto-detect Preact — equivalent of babel-preset-preact
        if (!this.options.jsx && this.context.components.has('preact')) {
            defaults.jsx = {
                runtime: 'automatic',
                importSource: 'preact'
            };
        }

        return Object.assign(defaults, this.options);
    }

    /**
     * Override the generated webpack configuration.
     * Replaces babel-loader with oxc-webpack-loader and
     * removes ts-loader (oxc handles TypeScript natively).
     *
     * @param {import('webpack').Configuration} config
     */
    webpackConfig(config) {
        if (!config.module || !config.module.rules) {
            return config;
        }

        const oxcOptions = this.buildOptions();

        // Filter out ts-loader rules — oxc handles TypeScript natively
        config.module.rules = config.module.rules.filter(rule => {
            if (!rule || typeof rule !== 'object') return true;

            const loader = typeof rule.loader === 'string' ? rule.loader : '';

            return !loader.includes('ts-loader');
        });

        // Replace babel-loader with oxc-webpack-loader
        for (const rule of config.module.rules) {
            if (!rule || typeof rule !== 'object' || !rule.use) {
                continue;
            }

            const uses = Array.isArray(rule.use) ? rule.use : [rule.use];

            for (let i = 0; i < uses.length; i++) {
                const use = uses[i];
                const loaderName =
                    typeof use === 'string'
                        ? use
                        : typeof use === 'object' && use.loader
                        ? use.loader
                        : '';

                if (loaderName.includes('babel-loader')) {
                    uses[i] = {
                        loader: this.context.resolve('oxc-webpack-loader'),
                        options: oxcOptions
                    };
                }
            }

            if (Array.isArray(rule.use)) {
                rule.use = uses;
            } else {
                rule.use = uses[0];
            }
        }

        return config;
    }
};
