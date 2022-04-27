/**
 *
 * @param {import("../Mix")} mix
 * @returns {import("webpack").RuleSetRule[]}
 */
module.exports = function (mix) {
    // TODO: Remove in Mix 7 -- Here for backwards compat if a plugin requires this file
    mix = mix || global.Mix;

    /** @returns {import("webpack").RuleSetRule[]} */
    function asset({ when = true, test, name, loaders = [] }) {
        if (! when) {
            return []
        }

        if (mix.config.assetModules) {
            return [{
                test,
                type: 'asset/resource',
                generator: {
                    filename: (pathData) => name(pathData, { dirs: mix.config.assetDirs }),
                    publicPath: mix.config.resourceRoot
                },
                use: loaders,
            }]
        }

        return [{
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
        }]
    }

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

    return [
        // Add support for loading HTML files.
        {
            test: /\.html$/,
            resourceQuery: { not: [/\?vue/i] },
            use: [{ loader: mix.resolve('html-loader') }]
        },

        // Add support for loading images.
        ...asset({
            when: mix.config.imgLoaderOptions,

            // only include svg that doesn't have font in the path or file name by using negative lookahead
            test: /(\.(png|jpe?g|gif|webp|avif)$|^((?!font).)*\.svg$)/,

            loaders: [
                {
                    loader: mix.resolve('img-loader'),
                    options: mix.config.imgLoaderOptions || {}
                },
            ],

            name: ({ filename }, { dirs }) => {
                if (isFromPackageManager(filename)) {
                    filename = normalizedPackageFilename(filename, ['images', 'image', 'img', 'assets'])

                    return `${dir.images}/vendor/${filename}?[hash]`;
                }

                return `${dirs.images}/[name][ext]?[hash]`;
            },
        }),

        // Add support for loading fonts.
        ...asset({
            test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
            name: ({ filename }, { dirs }) => {
                if (isFromPackageManager(filename)) {
                    filename = normalizedPackageFilename(filename, ['fonts', 'font', 'assets'])

                    return `${dir.fonts}/vendor/${filename}?[hash]`;
                }

                return `${dirs.fonts}/[name][ext]?[hash]`;
            },
        }),

        // Add support for loading cursor files.
        ...asset({
            test: /\.(cur|ani)$/,
            name: () => '[name][ext]?[hash]'
        }),
    ]
};
