/**
 * @param {Iterable<import("webpack").Chunk>} chunks
 */
function collectCssChunks(chunks) {
    const queue = [];

    for (const chunk of chunks) {
        for (const module of chunk.getModules()) {
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

module.exports.collectCssChunks = collectCssChunks;
