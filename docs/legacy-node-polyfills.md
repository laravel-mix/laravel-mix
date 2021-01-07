# Node Polyfills (Process and Buffer)

Webpack 5 no longer automatically includes polyfills for Node-specific objects like `Buffer` and `process`. However,
it's possible that your project, or one of its dependencies, still requires access to these variables. If so, you can
force Mix to include the necessary Node polyfills via the legacyNodePolyfills` option.

```js
mix.options({
    legacyNodePolyfills: true
});
```

Keep in mind that this might result in a slightly larger bundle. If possible, take the necessary steps to eventually
remove these references from your front-end code - and then turn off `legacyNodePolyfills` to reduce your bundle size.

