let glob = require('glob');
let Assert = require('../Assert');
let Vue = require('./Vue');

class JavaScript {
    constructor() {
        this.vue = new Vue();
        this.toCompile = [];
    }

    /**
     * The API name for the component.
     */
    name() {
        let name = this.constructor.name.toLowerCase();

        return name === 'javascript' ? ['js', 'vue'] : name;
    }

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return this.vue.dependencies();
    }

    /**
     * Register the component.
     *
     * @param {*} entry
     * @param {string} output
     */
    register(entry, output) {
        if (typeof entry === 'string' && entry.includes('*')) {
            entry = glob.sync(entry);
        }

        Assert.js(entry, output);

        entry = [].concat(entry).map(file => new File(file));
        output = new File(output);

        this.toCompile.push({ entry, output });

        Mix.bundlingJavaScript = true;
    }

    /**
     * Assets to append to the webpack entry.
     *
     * @param {Entry} entry
     */
    webpackEntry(entry) {
        this.toCompile.forEach(js => {
            entry.addFromOutput(
                js.entry.map(file => file.path()),
                js.output,
                js.entry[0]
            );
        });
    }

    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [].concat([
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: Config.babel()
                    }
                ]
            }
        ]);
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} webpackConfig
     */
    webpackConfig(webpackConfig) {
        this.vue.webpackConfig(webpackConfig);
    }
}

module.exports = JavaScript;
