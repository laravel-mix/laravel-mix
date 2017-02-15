# BrowserSync

```js
mix.browserSync('my-site.dev');
```

BrowserSync will automatically monitor your files for changes, and insert your changes into the browser - all without requiring a manual refresh. You may enable support by calling the `mix.browserSync()` method, like so:

```js
mix.browserSync('my-domain.dev');

// Or:

// https://browsersync.io/docs/options/
mix.browserSync({
    proxy: 'my-domain.dev'
})
```

You may pass either a string (proxy) or object (BrowserSync settings) to this method. The domain name you declare as your proxy is vital. This will proxy output from Webpack Dev Server through BrowserSync.

Now, boot up the dev server (`npm run watch`), and you're all set go!


