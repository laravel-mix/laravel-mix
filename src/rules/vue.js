module.exports = (Config, vueExtractPlugin) => ({
  test: /\.vue$/,
  loader: 'vue-loader',
  exclude: /bower_components/,
  options: Object.assign(
    {
      // extractCSS: Config.extractVueStyles,
      loaders: Config.extractVueStyles
        ? {
          js: {
            loader: 'babel-loader',
            options: Config.babel()
          },

          scss: vueExtractPlugin.extract({
            use: 'css-loader!sass-loader',
            fallback: 'vue-style-loader'
          }),

          sass: vueExtractPlugin.extract({
            use: 'css-loader!sass-loader?indentedSyntax',
            fallback: 'vue-style-loader'
          }),

          css: vueExtractPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader'
          }),

          stylus: vueExtractPlugin.extract({
            use:
              'css-loader!stylus-loader?paths[]=node_modules',
            fallback: 'vue-style-loader'
          }),

          less: vueExtractPlugin.extract({
            use: 'css-loader!less-loader',
            fallback: 'vue-style-loader'
          })
        }
        : {
          js: {
            loader: 'babel-loader',
            options: Config.babel()
          }
        },
      postcss: Config.postCss
    },
    Config.vue
  )
})