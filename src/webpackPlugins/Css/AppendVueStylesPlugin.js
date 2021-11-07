// @ts-check

/**
 * This plugin ensures that vue styles are always appended to the end of CSS files
 */
class AppendVueStylesPlugin {
    /** @param {import("webpack").Compiler} compiler */
    apply(compiler) {
        const name = 'AppendVueStylesPlugin';

        compiler.hooks.compilation.tap(name, compilation => {
            compilation.hooks.optimizeChunks.tap(name, chunks => {
                this.reorderModules(compilation.chunkGraph, chunks);
            });
        });
    }

    /**
     *
     * @param {import("webpack").ChunkGraph} graph
     * @param {Iterable<import("webpack").Chunk>} chunks
     */
    reorderModules(graph, chunks) {
        const queue = this.collectCssChunks(graph, chunks);

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

    /**
     * @param {import("webpack").ChunkGraph} graph
     * @param {Iterable<import("webpack").Chunk>} chunks
     */
    collectCssChunks(graph, chunks) {
        const queue = [];

        for (const chunk of chunks) {
            for (const module of graph.getChunkModulesIterable(chunk)) {
                if (module.type !== 'css/mini-extract') {
                    continue;
                }

                for (const group of chunk.groupsIterable) {
                    queue.push({ module, chunk, group });
                }
            }
        }

        return queue;
    }
}

module.exports = AppendVueStylesPlugin;
