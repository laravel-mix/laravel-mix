module.exports = (Config) => ({
  // only include svg that doesn't have font in the path or file name by using negative lookahead
  test: /(\.(png|jpe?g|gif)$|^((?!font).)*\.svg$)/,
    loaders: [
  {
    loader: 'file-loader',
    options: {
      name: path => {
        if (!/node_modules|bower_components/.test(path)) {
          return (
            Config.fileLoaderDirs.images +
            '/[name].[ext]?[hash]'
          );
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