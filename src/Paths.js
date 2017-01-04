let path = require('path');

module.exports = {
    /**
     * Determine the path to the user's webpack.mix.js file.
     */
    mix: function () {
        return this.root('webpack.mix');
    },


    /**
     * Determine the project root.
     *
     * @param {string|null} append
     */
    root: function(append = '') {
        return path.resolve(__dirname, '../../../', append)
    }
}
