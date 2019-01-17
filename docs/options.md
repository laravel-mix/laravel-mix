# Mix Options

```js
mix.options({
    extractVueStyles: false,
    processCssUrls: true,
    terser: {},
    purifyCss: false,
    //purifyCss: {},
    postCss: [require('autoprefixer')],
    clearConsole: false,
    cssNano: {
        // discardComments: {removeAll: true},
    }
});
```

A handful of Mix options and overrides are available, should you require them. Please take note of the options above, as well as their default values. Here's a quick overview:

-   **extractVueStyles:** Extract `.vue` component styling (CSS within `<style>` tags) to a dedicated file, rather than inlining it into the HTML.
-   **globalVueStyles:** Indicate a file to include in every component styles. This file should only include variables, functions or mixins in order to prevent duplicated css in your final, compiled files. This option only works when `extractVueStyles` is enabled.
-   **processCssUrls:** Process/optimize relative stylesheet url()'s. By default, Webpack will automatically update these URLs, when relevant. If, however, your folder structure is already organized the way you want it, set this option to `false` to disable processing.
-   **terser:** Use this option to merge any [custom Terser options](https://github.com/webpack-contrib/terser-webpack-plugin#options) that your project requires.
-   **purifyCss:** Set this option to `true` if you want Mix to automatically read your HTML/Blade files and strip your CSS bundle of all unused selectors. You can also pass an object containing [purifycss-webpack options](https://github.com/webpack-contrib/purifycss-webpack#options).
-   **postCss:** Merge any custom postcss plugins.
-   **clearConsole:** Set this to false, if you don't want the terminal/console to clear after each build.
-   **cssNano** Use this option to set [cssnano options](https://cssnano.co/optimisations/) that your project requires.
