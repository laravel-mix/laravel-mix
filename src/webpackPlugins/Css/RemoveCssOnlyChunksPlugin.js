// @ts-check

const { collectCssChunks } = require('./Helpers');

/**
 * This plugin is used to work around
 */
class RemoveCssOnlyChunksPlugin {
    /** @param {import("webpack").Compiler} compiler */
    apply(compiler) {
        const name = 'RemoveCssOnlyChunksPlugin';

        compiler.hooks.compilation.tap(name, compilation => {
            compilation.hooks.afterOptimizeChunks.tap(name, chunks => {
                this.removeCssOnlyChunks(chunks);
            });
        });
    }

    /**
     * Removes CSS-only chunks from intial / entrypoint groups
     * FIXME: I feel like this could break a lot of things. Will need major testing.
     *
     * @param {Iterable<import("webpack").Chunk>} chunks
     */
    removeCssOnlyChunks(chunks) {
        const queue = collectCssChunks(chunks);

        for (const item of queue) {
            if (item.group.isInitial) {
                item.group.removeChunk(item.chunk);
            }
        }
    }
}

module.exports = RemoveCssOnlyChunksPlugin;
