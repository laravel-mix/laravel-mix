# Mix Options

```js
mix.options({
  extractVueStyles: false,
  processCssUrls: true,
  uglify: {},
  postCss: []
});
```

A handful of Mix options and overrides are available, should you require them. Please take note of the options above, as well as their default values. Here's a quick overview:

- **extractVueStyles:** Extract `.vue` component styling (CSS within `<style>` tags) to a dedicated file, rather than inlining it into the HTML.
- **processCssUrls:** Process/optimize relative stylesheet url()'s. By default, Webpack will automatically update these URLs, when relevant. If, however, your folder structure is already organized the way you want it, set this option to `false` to disable processing.
- **uglify:** Use this option to merge any [custom Uglify options](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin) that your project requires.
- **postCss:** Here, you may add a list of PostCSS plugins to be applied to your compiled CSS.
