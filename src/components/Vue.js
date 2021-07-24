let { Chunks } = require('../Chunks');
let File = require('../File');
let VueVersion = require('../VueVersion');
let AppendVueStylesPlugin = require('../webpackPlugins/Css/AppendVueStylesPlugin');

/** @typedef {import("vue").VueLoaderOptions} VueLoaderOptions */

class Vue {
    /**
     * Create a new component instance.
     */
    constructor() {
        this.chunks = Chunks.instance();
    }

    /**
     * Register the component.
     *
     * @param {object} options
     * @param {number} [options.version] Which version of Vue to support. Detected automatically if not given.
     * @param {string|null} [options.globalStyles] A file to include w/ every vue style block.
     * @param {boolean|string} [options.extractStyles] Whether or not to extract vue styles. If given a string the name of the file to extract to.
     * @param {boolean} [options.useVueStyleLoader] Use vue-style-loader to extract Vue Styles.
     * @param {VueLoaderOptions} [options.options] Options to pass to Vue Loader
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

        this.version = new VueVersion(this._mix).detect(options.version);

        this.options = Object.assign(
            {
                options: null,
                globalStyles: null,
                extractStyles: false,
                useVueStyleLoader: false
            },
            options
        );

        Mix.globalStyles = this.options.globalStyles;
        Mix.extractingStyles = !!this.options.extractStyles;
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
     * @param {Object} webpackConfig
     */
    webpackConfig(webpackConfig) {
        // push -> unshift to combat vue loader webpack 5 bug
        webpackConfig.module.rules.unshift({
            test: /\.vue$/,
            use: [
                {
                    loader: this._mix.resolve('vue-loader'),
                    options: this.options.options || Config.vue || {}
                }
            ]
        });

        // Alias Vue to its ESM build if the user has not already given an alias
        webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};

        if (!webpackConfig.resolve.alias['vue$']) {
            webpackConfig.resolve.alias['vue$'] = this.aliasPath();
        }

        webpackConfig.resolve.extensions.push('.vue');

        this.updateChunks();
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
        let { VueLoaderPlugin } = require(this._mix.resolve('vue-loader'));

        return [new VueLoaderPlugin(), new AppendVueStylesPlugin()];
    }

    /**
     * Update CSS chunks to extract vue styles
     */
    updateChunks() {
        if (this.options.extractStyles === false) {
            return;
        }

        this.chunks.add(
            'styles-vue',
            this.styleChunkName(),
            [/.vue$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );

        this.chunks.add(
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
            let chunk = this.chunks.find((chunk, id) => id.startsWith('styles-'));

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

        return fileName.replace(Config.publicPath, '').replace(/^\//, '');
    }

    /**
     * @internal
     * @returns {import("../Mix")}
     **/
    get _mix() {
        // @ts-ignore
        return global.Mix;
    }
}

module.exports = Vue;
