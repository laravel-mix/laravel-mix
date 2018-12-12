let AutomaticComponent = require('./AutomaticComponent');

class Css extends AutomaticComponent {
    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'postcss-loader',
                        options: { plugins: Config.postCss }
                    }
                ]
            },

            {
                test: /\.scss$/,
                exclude: this.excludePathsFor('sass'),
                loaders: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            precision: 8,
                            outputStyle: 'expanded'
                        }
                    }
                ]
            },

            {
                test: /\.sass$/,
                exclude: this.excludePathsFor('sass'),
                loaders: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            precision: 8,
                            outputStyle: 'expanded',
                            indentedSyntax: true
                        }
                    }
                ]
            },

            {
                test: /\.less$/,
                exclude: this.excludePathsFor('less'),
                loaders: ['style-loader', 'css-loader', 'less-loader']
            },

            {
                test: /\.styl(us)?$/,
                exclude: this.excludePathsFor('stylus'),
                loaders: ['style-loader', 'css-loader', 'stylus-loader']
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
