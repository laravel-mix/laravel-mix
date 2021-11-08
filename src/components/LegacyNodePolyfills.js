const { Component } = require('./Component');

module.exports = class LegacyNodePolyfills extends Component {
    passive = true;

    dependencies() {
        return this.context.config.legacyNodePolyfills ? ['process', 'buffer'] : [];
    }

    webpackPlugins() {
        if (!this.context.config.legacyNodePolyfills) {
            return [];
        }

        const { ProvidePlugin } = require('webpack');

        return [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser.js'
            })
        ];
    }

    /**
     *
     * @param {import('webpack').Configuration} _
     * @returns {import('webpack').Configuration}
     */
    webpackConfig(_) {
        if (!this.context.config.legacyNodePolyfills) {
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
                    buffer: this.context.resolve('buffer/'),
                    process: this.context.resolve('process/browser.js')
                }
            }
        };
    }
};
