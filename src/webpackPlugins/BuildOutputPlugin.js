const chalk = require('chalk');
const Table = require('cli-table3');
const { formatSize } = require('webpack/lib/SizeFormatHelpers');

class BuildOutputPlugin {
    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tap('BuildOutputPlugin', stats => {
            const data = stats.toJson({
                assets: true,
                builtAt: true,
                hash: true,
                performance: true
            });

            const table = this.statsTable(data);

            console.log('\n');
            console.log(chalk.bgBlue.white.bold(this.section('Laravel Mix')));
            console.log();

            if (stats.hasErrors()) {
                console.log(chalk.red.bold(`✖︎ Error`));
            } else {
                console.log(chalk.green.bold(`✔ Success`));
            }

            console.log(chalk.blue.bold(`ℹ Built in ${data.time}ms`));
            console.log();
            console.log(table.toString());
        });
    }

    /**
     * @param {any} data
     * @returns {Table}
     */
    statsTable(data) {
        const table = new Table({
            head: ['File', 'Size']
        });

        for (const asset of data.assets) {
            table.push([asset.name, formatSize(asset.size)]);
        }

        return table;
    }

    /**
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
}

module.exports = BuildOutputPlugin;
