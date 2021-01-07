// @ts-check

const { collectCssChunks } = require('./Helpers');

/**
 * This plugin ensures that vue styles are always appended to the end of CSS files
 */
class AppendVueStylesPlugin {
    /** @param {import("webpack").Compiler} compiler */
    apply(compiler) {
        const name = 'AppendVueStylesPlugin';

        compiler.hooks.compilation.tap(name, compilation => {
            compilation.hooks.optimizeChunks.tap(name, chunks => {
                this.reorderModules(chunks);
            });
        });
    }

    /**
     *
     * @param {Iterable<import("webpack").Chunk>} chunks
     */
    reorderModules(chunks) {
        const queue = collectCssChunks(chunks);

        // Find the last module in the bundle
        let largestIndex = 0;

        for (const { module, group } of queue) {
            largestIndex = Math.max(largestIndex, group.getModulePostOrderIndex(module));
        }

        // Push all vue assets after it in their original order
        for (const { module, group } of queue) {
            if (module.identifier().includes('?vue')) {
                group.setModulePostOrderIndex(
                    module,
                    largestIndex + group.getModulePostOrderIndex(module)
                );
            }
        }
    }
}

module.exports = AppendVueStylesPlugin;
