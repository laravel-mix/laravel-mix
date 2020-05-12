let { VueLoaderPlugin } = require('vue-loader');
let { Chunks } = require('../Chunks');

class Vue {
    constructor() {
        this.chunks = Chunks.instance();
    }

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        let dependencies = ['vue-template-compiler'];

        if (Config.extractVueStyles && Config.globalVueStyles) {
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
                    loader: 'vue-loader',
                    options: Config.vue || {}
                }
            ]
        });

        webpackConfig.plugins.push(new VueLoaderPlugin());

        this.updateChunks();
    }

    /**
     * Update CSS chunks to extract vue styles
     *
     */
    updateChunks() {
        let existingChunk;

        // If the user set extractVueStyles: true, we'll try
        // to append the Vue styles to an existing CSS chunk.
        if (typeof Config.extractVueStyles === 'boolean') {
            if (!Config.extractVueStyles) {
                return;
            }

            existingChunk = this.chunks.find((chunk, id) => {
                // FIXME: This could possibly be smarter but for now it finds the first defined style chunk
                return id.startsWith('styles-');
            });
        }

        this.chunks.add(
            'styles-vue',
            existingChunk
                ? existingChunk.name
                : this.extractFile().relativePathWithoutExtension(),
            [/.vue$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );
    }

    /**
     * Determine the extract file name.
     */
    extractFileName() {
        let fileName =
            typeof Config.extractVueStyles === 'string'
                ? Config.extractVueStyles
                : '/css/vue-styles.css';

        return fileName.replace(Config.publicPath, '').replace(/^\//, '');
    }

    extractFile() {
        return new File(this.extractFileName());
    }
}

module.exports = Vue;
