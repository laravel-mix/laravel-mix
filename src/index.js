let Api = require('./Api');
let Mix = require('./Mix');

let mix = new Mix();

// The default export for this module will in fact
// be the fluent API for your webpack.mix.js file.
module.exports = api = new Api(mix);
module.exports.mix = api; // Deprecated.

// However, you can access the Mix instance like this:
module.exports.config = mix;

// We'll export a handful of common plugins for a cleaner config file.
module.exports.plugins = {
    WebpackNotifierPlugin: require('webpack-notifier'),
    WebpackOnBuildPlugin: require('on-build-webpack'),
    ExtractTextPlugin: require('extract-text-webpack-plugin'),
    CopyWebpackPlugin: require('copy-webpack-plugin'),
    FriendlyErrorsWebpackPlugin: require('friendly-errors-webpack-plugin'),
    StatsWriterPlugin: require('webpack-stats-plugin').StatsWriterPlugin,
    WebpackMd5HashPlugin: require('webpack-md5-hash'),
    BrowserSyncPlugin: require('browser-sync-webpack-plugin')
};
