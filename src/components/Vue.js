let { VueLoaderPlugin } = require('vue-loader');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

class Vue {
    boot() {
        if (Config.extractVueStyles) {
            let filename =
                typeof Config.extractVueStyles === 'string'
                    ? Config.extractVueStyles
                    : '/css/vue-styles.css';

            this.extractPlugin = new ExtractTextPlugin({ filename });
            this.shouldExtractCss = true;
        }
    }

    webpackRules() {
        if (this.shouldExtractCss) {
            return {
                test: /\.css$/,
                use: this.extractPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: ['css-loader']
                })
            };
        }

        return [];
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} webpackConfig
     */
    webpackConfig(webpackConfig) {
        webpackConfig.module.rules.push({
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /bower_components/
        });

        if (this.shouldExtractCss) {
            webpackConfig.plugins.push(this.extractPlugin);
        }

        webpackConfig.plugins.push(new VueLoaderPlugin());
    }
}

module.exports = Vue;
