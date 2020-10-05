class SourceMaps {
    register(
        generateForProduction = true,
        devType = 'eval-source-map',
        productionType = 'source-map'
    ) {
        let type = devType;

        if (Mix.inProduction()) {
            type = generateForProduction ? productionType : false;
        }

        Config.sourcemaps = type;

        return this;
    }
}

module.exports = SourceMaps;
