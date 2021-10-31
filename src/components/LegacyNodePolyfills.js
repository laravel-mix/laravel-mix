const AutomaticComponent = require('./AutomaticComponent');
const webpack = require('webpack');

class LegacyNodePolyfills extends AutomaticComponent {
    dependencies() {
        return Config.legacyNodePolyfills ? ['process', 'buffer'] : [];
    }

    webpackPlugins() {
        if (!Config.legacyNodePolyfills) {
            return [];
        }

        return [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser.js'
            })
        ];
    }

    webpackConfig() {
        if (!Config.legacyNodePolyfills) {
            return {
                resolve: {
                    fallback: {
                        Buffer: false,
                        process: false
                    }
                }
            };
        }

        return {
            resolve: {
                fallback: {
                    buffer: Mix.resolve('buffer/'),
                    process: Mix.resolve('process/browser.js')
                }
            }
        };
    }
}

module.exports = LegacyNodePolyfills;
