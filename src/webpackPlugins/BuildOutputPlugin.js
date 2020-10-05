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
            if (stats.hasErrors()) {
                return false;
            }

            console.log('\n');
            console.log(
                chalk.bgBlue.white.bold(this.section('Laravel Mix v6'))
            );

            console.log(
                this.statsTable(
                    stats.toJson({
                        assets: true,
                        builtAt: true,
                        hash: true,
                        performance: true
                    })
                )
            );
        });
    }

    /**
     * Generate the stats table.
     *
     * @param {any} data
     * @returns {Table}
     */
    statsTable(data) {
        const table = new Table({
            head: [chalk.bold('File'), chalk.bold('Size')],
            colWidths: [35],
            style: {
                head: []
            }
        });

        for (const asset of data.assets) {
            table.push([chalk.green(asset.name), formatSize(asset.size)]);
        }

        return table.toString();
    }

    /**
     * Create a block section.
     *
     * @param {string} text
     */
    section(text) {
        const padLength = 17;
        const padding = ' '.repeat(padLength);

        text = `${padding}${text}${padding}`;

        const line = ' '.repeat(text.length);

        return `${line}\n${text}\n${line}`;
    }
}

module.exports = BuildOutputPlugin;
