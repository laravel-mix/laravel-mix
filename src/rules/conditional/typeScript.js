module.exports = (Config) => ({
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
  options: {
    appendTsSuffixTo: [/\.vue$/]
  }
});