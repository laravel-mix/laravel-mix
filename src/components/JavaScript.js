let glob = require('glob');
let Verify = require('../Verify');
let MockEntryPlugin = require('../webpackPlugins/MockEntryPlugin');
let Vue = require('./Vue');

class JavaScript {
    constructor() {
        this.vue = new Vue();
    }

    name() {
        let name = this.constructor.name.toLowerCase();

        return name === 'javascript' ? ['js', 'vue'] : name;
    }

    dependencies() {
        return this.vue.dependencies();
    }

    register(entry, output) {
        if (typeof entry === 'string' && entry.includes('*')) {
            entry = glob.sync(entry);
        }

        Verify.js(entry, output);

        entry = [].concat(entry).map(file => new File(file));
        output = new File(output);

        Config.js.push({ entry, output });
    }

    webpackEntry(entry) {
        Config.js.forEach(js => {
            entry.addFromOutput(
                js.entry.map(file => file.path()),
                js.output,
                js.entry[0]
            );
        });
    }

    webpackRules() {
        return [
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
        ].concat(this.vue.webpackRules());
    }

    webpackPlugins() {
        return this.vue.webpackPlugins();
    }
}

module.exports = JavaScript;
