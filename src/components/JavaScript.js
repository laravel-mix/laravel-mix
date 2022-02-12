const glob = require('glob');
const File = require('../File');
const Assert = require('../Assert');
const { Component } = require('./Component');

module.exports = class JavaScript extends Component {
    /** @type {{entry: File[], output: File}[]} */
    toCompile = [];

    /**
     * The API name for the component.
     */
    name() {
        let name = this.constructor.name.toLowerCase();

        return [name === 'javascript' ? 'js' : name];
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

        this.toCompile.push({ entry, output: new File(output) });

        this.context.bundlingJavaScript = true;
    }

    /**
     * Assets to append to the webpack entry.
     *
     * @param {import('../builder/Entry')} entry
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
                        loader: this.context.resolve('babel-loader'),
                        options: this.context.config.babel()
                    }
                ]
            }
        ];
    }
};
