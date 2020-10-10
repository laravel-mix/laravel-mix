# Browsersync

Browsersync will automatically monitor your files for changes, and inject any changes into the browser - all without requiring a manual refresh. 
You can enable support by calling the `mix.browserSync()` command, like so:

```js
mix.browserSync('my-domain.test');
```

If you need to pass configuration options to the underlying Browsersync, instead pass an object.

```
mix.browserSync({
    proxy: 'my-domain.test',
});
```

All Browsersync configuration options may be reviewed on the [Browsersync](https://browsersync.io/docs/options/) website.

