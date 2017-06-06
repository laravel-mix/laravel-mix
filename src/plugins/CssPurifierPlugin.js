let Purifier = require('purifycss-webpack');
let glob = require('glob');

class CssPurifierPlugin {
    /**
     * Build up the plugin.
     */
    static build() {
        let bladeFiles = glob.sync(Mix.paths.root('resources/views/**/*.blade.php'));
        let vueFiles = glob.sync(Mix.paths.root('resources/assets/js/**/*.vue'));

        let paths = bladeFiles.concat(vueFiles);

        if (Config.purifyCss.paths) {
            paths = paths.concat(Config.purifyCss.paths);
        }

        paths = Object.assign({ paths }, { minimize: Mix.inProduction() }).paths;

        return new Purifier({ paths: paths });
    }
}

module.exports = CssPurifierPlugin;
