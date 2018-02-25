module.exports = (Config) => ({
  test: /\.s[ac]ss$/,
  exclude: Config.preprocessors.sass
    ? Config.preprocessors.sass.map(sass => sass.src.path())
    : [],
  loaders: ['style-loader', 'css-loader', 'sass-loader']
});