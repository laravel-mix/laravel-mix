let AutomaticComponent = require('./AutomaticComponent');

class Css extends AutomaticComponent {
    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },

            {
                test: /\.scss$/,
                exclude: this.excludePathsFor('sass'),
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },

            {
                test: /\.sass$/,
                exclude: this.excludePathsFor('sass'),
                loaders: [
                    'style-loader',
                    'css-loader',
                    { loader: 'sass-loader', options: { indentedSyntax: true } }
                ]
            },

            {
                test: /\.less$/,
                exclude: this.excludePathsFor('less'),
                loaders: ['style-loader', 'css-loader', 'less-loader']
            }
        ];
    }

    /**
     * Paths to be excluded from the loader.
     *
     * @param {string} preprocessor
     */
    excludePathsFor(preprocessor) {
        let exclusions = Mix.components.get(preprocessor);

        return exclusions
            ? exclusions.details.map(preprocessor => preprocessor.src.path())
            : [];
    }
}

module.exports = Css;
