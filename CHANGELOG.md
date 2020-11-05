# Changelog

## 6.0

[View upgrade guide.](https://github.com/JeffreyWay/laravel-mix/blob/master/UPGRADE.md)

### Added

-   Support for webpack 5
-   New `npx mix` executable for triggering your build
-   Support for Vue 3 applications
-   Support for PostCSS 8
-   New `mix.vue()` and `mix.react()` commands
-   New `mix.alias()` command ([Learn More](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/aliases.md))
-   Support for changing the webpack manifest output path ([Learn More](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/extract.md#customizing-the-runtime-chunk-manifestjs-path))
-   New `mix.before()` hook ([Learn More](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/event-hooks.md#run-a-function-before-webpack-compiles))
-   Improved `mix.combine()` wildcard support
-   Improved `mix.extract()` priority and tree-shaking logic

### Changed

-   Fixed "empty CSS file" extraction bug when using dynamic imports
-   Fixed `mix.ts()` TypeScript bug that skipped Babel transformation in certain cases
-   Fixed and improved PostCSS plugin autoloading and merging
-   Fixed an issue related to hot module reloading when versioning is enabled
-   Added TypeScript types for API
