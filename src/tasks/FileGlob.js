let path = require('path');
let { glob } = require('glob');
let File = require('../File');
let { concat } = require('lodash');

/** @internal */
module.exports.FileGlob = class FileGlob {
    /**
     * Find all relevant files matching the given source path.
     *
     * @param   {string|string[]} src
     * @param   {{ ignore?: string[] }} options
     * @returns {Promise<string[]>}
     */
    static async expand(src, { ignore = [] } = {}) {
        const paths = concat([], src);

        const results = await Promise.all(
            paths.map(async srcPath => {
                const result = await this.find(srcPath);

                if (!result.isDir && result.matches.length === 0) {
                    return [srcPath];
                }

                return result.matches;
            })
        );

        const filepaths = results.flatMap(files => files);

        return filepaths.filter(filepath => {
            return !ignore.includes(filepath);
        });
    }

    /**
     *
     * @internal
     * @param {string} src
     * @returns {Promise<{isDir: boolean, matches: string[]}>}
     */
    static async find(src) {
        const isDir = File.find(src).isDirectory();
        const pattern = isDir ? path.join(src, '**/*') : src;

        // glob 13's promise API no longer sorts results; sort for determinism.
        const matches = (await glob(pattern, { nodir: true })).sort();

        return {
            isDir,
            matches
        };
    }
};
