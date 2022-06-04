const { Component } = require('./Component');
const File = require('../File');
const VueVersion = require('../VueVersion');
const AppendVueStylesPlugin = require('../webpackPlugins/Css/AppendVueStylesPlugin');

module.exports = class Vue extends Component {
    version = 2;

    /**
     * @type {import('laravel-mix').VueConfig} options
     */
    options = {
        version: undefined,
        runtimeOnly: false,
        options: null,
        globalStyles: null,
        extractStyles: false,
        useVueStyleLoader: false
    };

    /**
     * Register the component.
     *
     * @param {import('laravel-mix').VueConfig} options
     */
    register(options = {}) {
        if (
            arguments.length === 2 &&
            typeof arguments[0] === 'string' &&
            typeof arguments[1] === 'string'
        ) {
            throw new Error(
                'mix.vue() is a feature flag. Use mix.js(source, destination).vue() instead'
            );
        }

        Object.assign(this.options, options);

        this.version = new VueVersion(this.context).detect(this.options.version);

        if (this.options.globalStyles !== undefined) {
            this.context.globalStyles = this.options.globalStyles;
        }

        if (this.options.extractStyles !== undefined) {
            this.context.extractingStyles =
                this.context.extractingStyles || !!this.options.extractStyles;
        }

        this.addDefines();

        this.context.api.alias({
            vue$: {
                raw: this.aliasPath()
            }
        });
    }

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        this.requiresReload = true;

        let dependencies = [
            this.version === 2 ? 'vue-template-compiler' : '@vue/compiler-sfc',
            this.version === 2 ? 'vue-loader@^15.9.7' : 'vue-loader@^16.2.0'
        ];

        if (this.options.extractStyles && this.options.globalStyles) {
            dependencies.push('sass-resources-loader');
        }

        return dependencies;
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {import('webpack').Configuration} config
     */
    webpackConfig(config) {
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];
        config.resolve = config.resolve || {};
        config.resolve.extensions = config.resolve.extensions || [];

        // push -> unshift to combat vue loader webpack 5 bug
        config.module.rules.unshift({
            test: /\.vue$/,
            use: [
                {
                    loader: this.context.resolve('vue-loader'),
                    options: this.options.options || this.context.config.vue || {}
                }
            ]
        });

        // Alias Vue to its ESM build if the user has not already given an alias
        config.resolve.extensions.push('.vue');

        // Disable es modules for file-loader on Vue 2
        if (this.version === 2) {
            for (const rule of config.module.rules || []) {
                if (typeof rule !== 'object') {
                    continue;
                }

                let loaders = rule.use || [];

                if (!Array.isArray(loaders)) {
                    continue;
                }

                for (const loader of loaders) {
                    if (typeof loader !== 'object') {
                        continue;
                    }

                    // TODO: This isn't the best check
                    // We should check that the loader itself is correct
                    // Not that file-loader is anywhere in it's absolute path
                    // As this can produce false positives
                    if (
                        loader.loader &&
                        loader.loader.includes('file-loader') &&
                        loader.options
                    ) {
                        // @ts-ignore
                        loader.options.esModule = false;
                    }
                }
            }
        }

        this.updateChunks();

        return config;
    }

    aliasPath() {
        if (this.version === 2) {
            return this.options.runtimeOnly
                ? 'vue/dist/vue.runtime.esm.js'
                : 'vue/dist/vue.esm.js';
        }

        return this.options.runtimeOnly
            ? 'vue/dist/vue.runtime.esm-bundler.js'
            : 'vue/dist/vue.esm-bundler.js';
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        let { VueLoaderPlugin } = require(this.context.resolve('vue-loader'));

        return [new VueLoaderPlugin(), new AppendVueStylesPlugin()];
    }

    /**
     * Update CSS chunks to extract vue styles
     */
    updateChunks() {
        if (this.options.extractStyles === false) {
            return;
        }

        this.context.chunks.add(
            'styles-vue',
            this.styleChunkName(),
            [/.vue$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );

        this.context.chunks.add(
            'styles-jsx',
            this.styleChunkName(),
            [/.jsx$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );
    }

    /**
     * Get the name of the style chunk.
     *
     * @returns {string}
     */
    styleChunkName() {
        // If the user set extractStyles: true, we'll try
        // to append the Vue styles to an existing CSS chunk.
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
                : '/css/vue-styles.css';

        return fileName.replace(this.context.config.publicPath, '').replace(/^\//, '');
    }

    /**
     * Determine the extract file name.
     *
     * @internal
     */
    addDefines() {
        if (this.version === 2) {
            return;
        }

        this.context.api.define({
            __VUE_OPTIONS_API__: 'true',
            __VUE_PROD_DEVTOOLS__: 'false'
        });
    }
};
