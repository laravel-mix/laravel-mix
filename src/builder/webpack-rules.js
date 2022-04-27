/**
 *
 * @param {import("../Mix")} mix
 */
module.exports = function (mix) {
    // TODO: Remove in Mix 7 -- Here for backwards compat if a plugin requires this file
    mix = mix || global.Mix;

    function buildRule({ test, name = null, loaders = [] }) {
        if (mix.config.assetModules) {
            return {
                test,
                type: 'asset/resource',
                generator: {
                    filename: (pathData) => name(pathData, { dirs: mix.config.assetDirs }),
                    publicPath: mix.config.resourceRoot
                },
                use: loaders,
            }
        }

        return {
            test,
            use: [
                {
                    loader: mix.resolve('file-loader'),
                    options: {
                        // we're somewhat mimic-ing the asset module API here to simply name resolution further down
                        name: (path) =>
                            name({ filename: path }, { dirs: mix.config.fileLoaderDirs || mix.config.assetDirs })
                                .replace('[ext]', '.[ext]'),
                        publicPath: mix.config.resourceRoot
                    }
                },
                ...loaders,
            ]
        }
    }

    /** @type {import("webpack").RuleSetRule[]} */
    let rules = [];

    // Add support for loading HTML files.
    rules.push({
        test: /\.html$/,
        resourceQuery: { not: [/\?vue/i] },
        use: [{ loader: mix.resolve('html-loader') }]
    });

    function isFromPackageManager(filename) {
        return /node_modules|bower_components/.test(filename)
    }

    function normalizedPackageFilename(filename, dirs) {
        const WINDOWS_PATH_SEPARATORS = /\\/g;

        const patternTemplate = /((.*(node_modules|bower_components))|__DIRS__)\//g
        const vendoredPath = new RegExp(patternTemplate.replace('__DIRS__', dirs.join('|')), 'g')

        return filename
            .replace(WINDOWS_PATH_SEPARATORS, '/')
            .replace(vendoredPath, '')
    }

    if (mix.config.imgLoaderOptions) {
        // Add support for loading images.
        rules.push(buildRule({
            // only include svg that doesn't have font in the path or file name by using negative lookahead
            test: /(\.(png|jpe?g|gif|webp|avif)$|^((?!font).)*\.svg$)/,

            loaders: [
                {
                    loader: mix.resolve('img-loader'),
                    options: mix.config.imgLoaderOptions || {}
                },
            ],

            name: ({ filename }, { dirs }) => {
                if (!isFromPackageManager(filename)) {
                    return `${dirs.images}/[name][ext]?[hash]`;
                }

                filename = normalizedPackageFilename(filename, ['images', 'image', 'img', 'assets'])

                return `${dir.images}/vendor/${filename}?[hash]`;
            },
        }));
    }

    // Add support for loading fonts.
    rules.push(buildRule({
        test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
        name: ({ filename }, { dirs }) => {
            if (!isFromPackageManager(filename)) {
                return `${dirs.fonts}/[name][ext]?[hash]`;
            }

            filename = normalizedPackageFilename(filename, ['fonts', 'font', 'assets'])

            return `${dir.fonts}/vendor/${filename}?[hash]`;
        },
    }));

    // Add support for loading cursor files.
    rules.push(buildRule({
        test: /\.(cur|ani)$/,
        name: () => '[name][ext]?[hash]'
    }));

    return rules;
};
