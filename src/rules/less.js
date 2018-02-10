module.exports = (Config) => ({
  test: /\.less$/,
  exclude: Config.preprocessors.less
    ? Config.preprocessors.less.map(less => less.src.path())
    : [],
  loaders: ['style-loader', 'css-loader', 'less-loader']
});