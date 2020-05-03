/**
 * This plugin ensures that vue styles are always appended to the end of CSS files
 */
class AppendVueStylesPlugin {
    /**
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.compilation.tap('AppendVueStylesPlugin', compilation => {
            compilation.hooks.optimizeChunks.tap(
                'AppendVueStylesPlugin',
                chunks => {
                    const queue = [];

                    for (const chunk of chunks) {
                        for (const module of chunk.getModules()) {
                            if (module.type !== 'css/mini-extract') {
                                continue;
                            }

                            for (const group of chunk.groupsIterable) {
                                queue.push({ module, group });
                            }
                        }
                    }

                    this.reassignIds(queue);
                }
            );
        });
    }

    /**
     *
     * @param {import("webpack").ModuleGraph} cg
     * @param {{module: import("webpack").Module, group: any}[]} queue
     */
    reassignIds(queue) {
        // Get the largest index for CSS modules
        let largestIndex = 0;

        for (const { module, group } of queue) {
            largestIndex = Math.max(
                largestIndex,
                group.getModulePostOrderIndex(module)
            );
        }

        // Push all vue assets to the end in their original order
        for (const { module, group } of queue) {
            if (module._identifier.includes('?vue')) {
                group.setModulePostOrderIndex(
                    module,
                    largestIndex + group.getModulePostOrderIndex(module)
                );
            }
        }
    }
}

module.exports.AppendVueStylesPlugin = AppendVueStylesPlugin;
