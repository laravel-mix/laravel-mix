module.exports = (Config) => ({
  test: /\.(cur|ani)$/,
  loader: 'file-loader',
  options: {
    name: '[name].[ext]?[hash]',
    publicPath: Config.resourceRoot
  }
});