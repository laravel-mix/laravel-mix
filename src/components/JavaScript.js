let glob = require('glob');
let File = require('../File');
let Assert = require('../Assert');

class JavaScript {
    constructor() {
        this.toCompile = [];
    }

    /**
     * The API name for the component.
     */
    name() {
        let name = this.constructor.name.toLowerCase();

        return name === 'javascript' ? 'js' : name;
    }

    /**
     * Register the component.
     *
     * @param {any} entry
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
        return [
            {
                test: /\.(cjs|mjs|jsx?|tsx?)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: Mix.resolve('babel-loader'),
                        options: Config.babel()
                    }
                ]
            }
        ];
    }
}

module.exports = JavaScript;
