let FileCollection = require('../FileCollection');

/**
 * Create a new CopyWebpackPlugin instance.
 *
 * @param {array} copy
 */
module.exports = function CopyWebpackPlugin(copy) {
    copy.forEach(copy => {
        let filesToCopy = new FileCollection(copy.from).copyTo(copy.to);

        if (process.argv.includes('--watch') || process.argv.includes('--hot')) {
            filesToCopy.watch();
        }
    });
}
