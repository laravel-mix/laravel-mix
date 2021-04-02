# Changelog

## 6.0.14

-   `BabelConfig.fetchBabelRc` / `static BabelConfig.default` / `static BabelConfig.generate` have all been deprecated. They are no longer used by Mix itself but remain for backwards compatability.
-   `MixDefinitionsPlugin.getDefinitions` and `static MixDefinitionsPlugin.build` have been deprecated. They are no longer used by Mix itself but remain for backwards compatability.
-   `static Chunks._instance` / `static Chunks.instance()` / `static Chunks.reset()` are now deprecated and will be removed in a future release.
-   The static methods on `HotReloading` are now deprecated. They have been replaced with instance methods.
-   The use of the globals `Mix`, `Config`, and `webpackConfig` are now deprecated and will warn on use in Mix v7.

We are working toward an API for access to `Mix` for extensions that does not assume that it is a global or that it is the same instance in all cases.

In the mean time:

-   Uses of `Chunks.instance()` may be replaced with `Mix.chunks`
-   Uses of `Config` may be replaced with `Mix.config`
-   Uses of `webpackConfig` may be replaced with `Mix.webpackConfig`
-   Uses of `HotReloading.*` methods `Mix.hot.*`

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
