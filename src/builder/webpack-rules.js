/**
 *
 * @param {import("../Mix")} mix
 */
module.exports = function (mix) {
    // TODO: Remove in Mix 7 -- Here for backwards compat if a plugin requires this file
    mix = mix || global.Mix;

    /** @type {import("webpack").RuleSetRule[]} */
    let rules = [];

    // Add support for loading HTML files.
    rules.push({
        test: /\.html$/,
        resourceQuery: { not: [/\?vue/i] },
        use: [{ loader: mix.resolve('html-loader') }]
    });

    if (mix.config.imgLoaderOptions) {
        const imageRuleOptions = mix.config.assetModules
            ? {
                  type: 'asset/resource',
                  generator: {
                      filename: pathData => {
                          const relativePath = pathData.filename;

                          if (!/node_modules|bower_components/.test(relativePath)) {
                              return mix.config.assetDirs.images + '/[name][ext]?[hash]';
                          }

                          return (
                              mix.config.assetDirs.images +
                              '/vendor/' +
                              relativePath
                                  .replace(/\\/g, '/')
                                  .replace(
                                      /((.*(node_modules|bower_components))|images|image|img|assets)\//g,
                                      ''
                                  ) +
                              '?[hash]'
                          );
                      },
                      publicPath: mix.config.resourceRoot
                  },
                  use: [
                      {
                          loader: mix.resolve('img-loader'),
                          options: mix.config.imgLoaderOptions || {}
                      }
                  ]
              }
            : {
                  use: [
                      {
                          loader: mix.resolve('file-loader'),
                          options: {
                              /**
                               * @param {string} path
                               */
                              name: path => {
                                  if (!/node_modules|bower_components/.test(path)) {
                                      return (
                                          mix.config.fileLoaderDirs.images +
                                          '/[name].[ext]?[hash]'
                                      );
                                  }

                                  return (
                                      mix.config.fileLoaderDirs.images +
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
                              publicPath: mix.config.resourceRoot
                          }
                      },

                      {
                          loader: mix.resolve('img-loader'),
                          options: mix.config.imgLoaderOptions || {}
                      }
                  ]
              };

        // Add support for loading images.
        rules.push({
            // only include svg that doesn't have font in the path or file name by using negative lookahead
            test: /(\.(png|jpe?g|gif|webp|avif)$|^((?!font).)*\.svg$)/,
            ...imageRuleOptions
        });
    }

    const fontRuleOptions = mix.config.assetModules
        ? {
              type: 'asset/resource',
              generator: {
                  filename: pathData => {
                      const relativePath = pathData.filename;

                      if (!/node_modules|bower_components/.test(relativePath)) {
                          return mix.config.fileLoaderDirs.fonts + '/[name][ext]?[hash]';
                      }

                      return (
                          mix.config.fileLoaderDirs.fonts +
                          '/vendor/' +
                          relativePath
                              .replace(/\\/g, '/')
                              .replace(
                                  /((.*(node_modules|bower_components))|fonts|font|assets)\//g,
                                  ''
                              ) +
                          '?[hash]'
                      );
                  },
                  publicPath: mix.config.resourceRoot
              }
          }
        : {
              use: [
                  {
                      loader: mix.resolve('file-loader'),
                      options: {
                          /**
                           * @param {string} path
                           */
                          name: path => {
                              if (!/node_modules|bower_components/.test(path)) {
                                  return (
                                      mix.config.fileLoaderDirs.fonts +
                                      '/[name].[ext]?[hash]'
                                  );
                              }

                              return (
                                  mix.config.fileLoaderDirs.fonts +
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
                          publicPath: mix.config.resourceRoot
                      }
                  }
              ]
          };

    // Add support for loading fonts.
    rules.push({
        test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
        ...fontRuleOptions
    });

    const cursorRuleOptions = mix.config.assetModules
        ? {
              type: 'asset/resource',
              generator: {
                  filename: '[name][ext]?[hash]',
                  publicPath: mix.config.resourceRoot
              }
          }
        : {
              use: [
                  {
                      loader: mix.resolve('file-loader'),
                      options: {
                          name: '[name].[ext]?[hash]',
                          publicPath: mix.config.resourceRoot
                      }
                  }
              ]
          };

    // Add support for loading cursor files.
    rules.push({
        test: /\.(cur|ani)$/,
        ...cursorRuleOptions
    });

    return rules;
};
