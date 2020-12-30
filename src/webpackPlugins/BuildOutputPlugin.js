const argv = require('yargs');
const chalk = require('chalk');
const Table = require('cli-table3');
const readline = require('readline');
const { formatSize } = require('webpack/lib/SizeFormatHelpers');
const { version } = require('../../package.json');

/**
 * @typedef {object} BuildOutputOptions
 * @property {boolean} clearConsole
 **/

class BuildOutputPlugin {
    /**
     *
     * @param {BuildOutputOptions} options
     */
    constructor(options) {
        this.options = options;
        this.patched = false;
    }

    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        if (argv['$0'].includes('ava')) {
            return;
        }

        compiler.hooks.done.tap('BuildOutputPlugin', stats => {
            if (stats.hasErrors()) {
                return false;
            }

            if (this.options.clearConsole) {
                this.clearConsole();
            }

            let data = stats.toJson({
                assets: true,
                builtAt: true,
                hash: true,
                performance: true
            });

            this.heading(`Laravel Mix v${version}`);

            console.log(chalk.green.bold(`✔ Compiled Successfully in ${data.time}ms`));

            if (data.assets.length) {
                console.log(this.statsTable(data));
            }
        });
    }

    /**
     * Print a block section heading.
     *
     * @param text
     */
    heading(text) {
        console.log();

        console.log(chalk.bgBlue.white.bold(this.section(text)));

        console.log();
    }

    /**
     * Create a block section.
     *
     * @param {string} text
     */
    section(text) {
        const padLength = 3;
        const padding = ' '.repeat(padLength);

        text = `${padding}${text}${padding}`;

        const line = ' '.repeat(text.length);

        return `${line}\n${text}\n${line}`;
    }

    /**
     * Generate the stats table.
     *
     * @param {any} data
     * @returns {string}
     */
    statsTable(data) {
        const table = new Table({
            head: [chalk.bold('File'), chalk.bold('Size')],
            colWidths: [35],
            colAligns: ['right'],
            style: {
                head: [],
                compact: true
            }
        });

        for (const asset of data.assets) {
            table.push([chalk.green(asset.name), formatSize(asset.size)]);
        }

        this.monkeyPatchTruncate();

        return table.toString();
    }

    /**
     * Clear the entire screen.
     */
    clearConsole() {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);

        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }

    // Yeah, I know.
    monkeyPatchTruncate() {
        if (this.patched) {
            return;
        }

        this.patched = true;

        // @ts-ignore
        const utils = require('cli-table3/src/utils');
        const oldTruncate = utils.truncate;

        // cli-table3 can only do truncation at the end
        // We want the asset name to be truncated at the beginning if it's too long
        // FIXME: We really should set truncation location via a paramter or something
        // (or PR support for alignment-based truncation)

        /**
         *
         * @param {string} str
         * @param {number} desiredLength
         * @param {string} truncateChar
         */
        utils.truncate = (str, desiredLength, truncateChar) => {
            if (str.length > desiredLength) {
                str = `…${str.substr(-desiredLength + 2)}`;
            }

            return oldTruncate(str, desiredLength, truncateChar);
        };
    }
}

module.exports = BuildOutputPlugin;
