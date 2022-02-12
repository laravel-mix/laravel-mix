const { Component } = require('./Component');

module.exports = class SourceMaps extends Component {
    register(
        generateForProduction = true,
        devType = 'eval-source-map',
        productionType = 'source-map'
    ) {
        /** @type {string|false} */
        let type = devType;

        if (this.context.api.inProduction()) {
            type = generateForProduction ? productionType : false;
        }

        this.context.config.sourcemaps = type;
    }
};
