let { VueLoaderPlugin } = require('vue-loader');

class Vue {
    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} webpackConfig
     */
    webpackConfig(config) {
        config.module.rules.push({
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /bower_components/
        });

        config.plugins.push(new VueLoaderPlugin());
    }
}

module.exports = Vue;
