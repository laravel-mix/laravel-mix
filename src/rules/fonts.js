module.exports = (Config) => ({
  test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
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
});