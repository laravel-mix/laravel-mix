const semver = require('semver');
const File = require('../File');

class React {
    /** @type {import('laravel-mix').ReactConfig} */
    options = {
        extractStyles: false
    };

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        const dependencies = ['@babel/preset-react'];

        if (this.supportsFastRefreshing()) {
            return dependencies.concat([
                {
                    package: '@pmmmwh/react-refresh-webpack-plugin@^0.5.0-rc.0',
                    check: name =>
                        semver.satisfies(
                            require(`${name}/package.json`).version,
                            '^0.5.0-rc.0'
                        )
                },
                'react-refresh'
            ]);
        }

        return dependencies;
    }

    /**
     * Register the component.
     *
     * @param {import('laravel-mix').ReactConfig} options
     */
    register(options = {}) {
        if (
            arguments.length === 2 &&
            typeof arguments[0] === 'string' &&
            typeof arguments[1] === 'string'
        ) {
            throw new Error(
                'mix.react() is now a feature flag. Use mix.js(source, destination).react() instead'
            );
        }

        this.options = Object.assign(this.options, options);

        this.context.extractingStyles =
            this.context.extractingStyles || !!this.options.extractStyles;
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        if (!this.supportsFastRefreshing()) {
            return [];
        }

        const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

        return new ReactRefreshPlugin({ overlay: { sockPath: 'ws' } });
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        const plugins = this.supportsFastRefreshing()
            ? [Mix.resolve('react-refresh/babel')]
            : [];

        return {
            presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            plugins
        };
    }

    /**
     * Determine if the React version supports fast refreshing.
     */
    supportsFastRefreshing() {
        return Mix.isHot() && semver.satisfies(this.library().version, '>=16.9.0');
    }

    /**
     * Load the currently installed React library.
     */
    library() {
        return require('react');
    }

    /**
     * Update CSS chunks to extract React styles
     */
    updateChunks() {
        if (this.options.extractStyles === false) {
            return;
        }

        this.context.chunks.add(
            'styles-js',
            this.styleChunkName(),
            [/.(j|t)s$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );

        this.context.chunks.add(
            'styles-jsx',
            this.styleChunkName(),
            [/.(j|t)sx?$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} config
     */
    webpackConfig(config) {
        this.updateChunks();

        return config;
    }

    /**
     * Get the name of the style chunk.
     *
     * @returns {string}
     */
    styleChunkName() {
        // If the user set extractStyles: true, we'll try
        // to append the React styles to an existing CSS chunk.
        if (this.options.extractStyles === true) {
            let chunk = this.context.chunks.find((chunk, id) => id.startsWith('styles-'));

            if (chunk) {
                return chunk.name;
            }
        }

        return this.extractFile().relativePathWithoutExtension();
    }

    /**
     * Get a new File instance for the extracted file.
     *
     * @returns {File}
     */
    extractFile() {
        return new File(this.extractFileName());
    }

    /**
     * Determine the extract file name.
     *
     * @return {string}
     */
    extractFileName() {
        let fileName =
            typeof this.options.extractStyles === 'string'
                ? this.options.extractStyles
                : '/css/react-styles.css';

        return fileName.replace(Config.publicPath, '').replace(/^\//, '');
    }

    get context() {
        return global.Mix;
    }
}

module.exports = React;
