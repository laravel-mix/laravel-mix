module.exports = (Config) => ({
  test: /\.css$/,

    exclude: Config.preprocessors.postCss
  ? Config.preprocessors.postCss.map(postCss => postCss.src.path())
  : [],
  loaders: ['style-loader', 'css-loader']
});