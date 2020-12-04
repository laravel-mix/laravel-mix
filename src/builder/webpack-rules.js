module.exports = function() {
    let rules = [];

    // Add support for loading HTML files.
    rules.push({
        test: /\.html$/,
        resourceQuery: { not: [/\?vue/i] },
        use: [{ loader: 'html-loader' }]
    });

    // Add support for loading images.
    rules.push({
        // only include svg that doesn't have font in the path or file name by using negative lookahead
        test: /(\.(png|jpe?g|gif|webp)$|^((?!font).)*\.svg$)/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: path => {
                        if (!/node_modules|bower_components/.test(path)) {
                            return Config.fileLoaderDirs.images + '/[name].[ext]?[hash]';
                        }

                        return (
                            Config.fileLoaderDirs.images +
                            '/vendor/' +
                            path
                                .replace(/\\/g, '/')
                                .replace(
                                    /((.*(node_modules|bower_components))|images|image|img|assets)\//g,
                                    ''
                                ) +
                            '?[hash]'
                        );
                    },
                    publicPath: Config.resourceRoot
                }
            },

            {
                loader: 'img-loader',
                options: Config.imgLoaderOptions
            }
        ]
    });

    // Add support for loading fonts.
    rules.push({
        test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: path => {
                        if (!/node_modules|bower_components/.test(path)) {
                            return Config.fileLoaderDirs.fonts + '/[name].[ext]?[hash]';
                        }

                        return (
                            Config.fileLoaderDirs.fonts +
                            '/vendor/' +
                            path
                                .replace(/\\/g, '/')
                                .replace(
                                    /((.*(node_modules|bower_components))|fonts|font|assets)\//g,
                                    ''
                                ) +
                            '?[hash]'
                        );
                    },
                    publicPath: Config.resourceRoot
                }
            }
        ]
    });

    // Add support for loading cursor files.
    rules.push({
        test: /\.(cur|ani)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                    publicPath: Config.resourceRoot
                }
            }
        ]
    });

    return rules;
};
