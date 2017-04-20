global.options = require('./Options');
global.entry = require('./Entry');
global.path = require('path');
global.Paths = new (require('./Paths'));
global.events = new (require('./Dispatcher'));
global.File = require('./File');

let mix = new (require('./Mix'));

// The default export for this module will in fact
// be the fluent API for your webpack.mix.js file.
module.exports = api = new (require('./Api'))(mix);
module.exports.mix = api; // Deprecated.

// However, you can access the Mix instance like this:
module.exports.config = mix;

// We'll export a handful of common plugins for a cleaner config file.
module.exports.plugins = {
    WebpackNotifierPlugin: require('webpack-notifier'),
    WebpackOnBuildPlugin: require('on-build-webpack'),
    ExtractTextPlugin: require('extract-text-webpack-plugin'),
    FriendlyErrorsWebpackPlugin: require('friendly-errors-webpack-plugin'),
    StatsWriterPlugin: require('webpack-stats-plugin').StatsWriterPlugin,
    WebpackChunkHashPlugin: require('webpack-chunk-hash'),
    BrowserSyncPlugin: require('browser-sync-webpack-plugin'),
    CopyWebpackPlugin: require('./WebpackPlugins/CopyWebpackPlugin'),
    MockEntryPlugin: require('./WebpackPlugins/MockEntryPlugin')
};
