let Mix = require('./Mix');
let Paths = require('./Paths');
let Dispatcher = require('./Dispatcher');
let Api = require('./Api');
let Options = require('./Options');
let Entry = require('./Entry');
let path = require('path');
let File = require('./File');

global.options = Options;
global.entry = Entry;
global.path = path;
global.File = File;
global.Paths = new Paths();
global.events = new Dispatcher();

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
    WebpackChunkHashPlugin: require('webpack-chunk-hash'),
    BrowserSyncPlugin: require('browser-sync-webpack-plugin'),
    MockEntryPlugin: require('./WebpackPlugins/MockEntryPlugin')
};
