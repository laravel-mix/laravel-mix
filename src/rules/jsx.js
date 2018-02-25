module.exports = (Config) => ({
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: [
    {
      loader: 'babel-loader',
      options: Config.babel()
    }
  ]
});