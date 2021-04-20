# Browsersync

Browsersync will automatically monitor your files for changes, and inject any changes into the browser - all without requiring a manual refresh. 
You can enable support by calling the Browsersync command, like so:

```js
mix.browserSync();
```
The proxy will automatically default to your project's folder name and will assume a ```.test``` TLD in line with the default Laravel Vale naming convention. You can customise the domain by passing a string to the Browsersync command:

```js
mix.browserSync('my-domain.test');
```

If you need to pass configuration options to the underlying Browsersync, instead pass an object.

```js
mix.browserSync({
    proxy: 'my-domain.test',
});
```

All Browsersync configuration options may be reviewed on the [Browsersync](https://browsersync.io/docs/options/) website.

