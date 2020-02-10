let Purifier = require('purifycss-webpack');
let glob = require('glob');

class CssPurifierPlugin {
    /**
     * Build up the plugin.
     */
    static build() {
        let bladeFiles = glob.sync(
            Mix.paths.root('resources/views/**/*.blade.php')
        );
        let vueFiles = glob.sync(
            Mix.paths.root('resources/js/**/*.vue')
        );

        let paths = bladeFiles.concat(vueFiles);

        if (Config.purifyCss.paths) {
            paths = paths.concat(Config.purifyCss.paths);
        }

        return new Purifier(
            Object.assign({}, Config.purifyCss, {
                paths,
                minimize: Mix.inProduction()
            })
        );
    }
}

module.exports = CssPurifierPlugin;
