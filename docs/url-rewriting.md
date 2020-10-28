# CSS URL Rewriting

-   [An Example](#an-example)

One key concept to understand is that Mix and webpack will rewrite any `url()`s within your stylesheets. While this might initially sound strange, it's incredibly powerful.

### An Example

Imagine that you want to compile a bit of Sass that includes a url to an image.

```scss
.example {
    background: url('../images/thing.png');
}
```

Notice how that the URL is a relative path? By default, Laravel Mix and webpack will locate `thing.png`, copy it to your `dist/images` folder, and then rewrite the `url()` to point to the new output location within your generated stylesheet. As such, your compiled CSS will ultimately be:

```css
.example {
    background: url(/images/thing.png?d41d8cd98f00b204e9800998ecf8427e);
}
```

> **Tip:** Absolute paths for `url()`s will always be excluded from url-rewriting. For instance, `url('/images/thing.png')` or `url('http://example.com/images/thing.png')` won't be touched.

This, again, is a very cool feature of webpack's. However, it does have a tendency to confuse those who don't understand how webpack and its css-loader plugin works.
It's possible that your folder structure is already just how you want it, and you'd prefer that Mix not modify those `url()`s. If that's the case, we do offer an override:

```js
mix.sass('src/app.scss', 'dist').options({
    processCssUrls: false
});
```

With this addition to your `webpack.mix.js` file, Mix will no longer match `url()`s or copy assets to your public directory. Instead, your compiled CSS will remain exactly as you typed it:

```css
.example {
    background: url('../images/thing.png');
}
```

> As a bonus, when you disable url processing, your Webpack Sass compilation will be much faster.

### Per-file rewrite settings

Url rewriting can be controlled on a per-file basis by specifying the `processUrls` option. This option will take precedence over what has been specified via the `processCssUrls` mix option.

```js
mix.options({
    // Don't perform any css url rewriting by default
    processCssUrls: false,
})

mix.sass('src/app.scss', 'dist', {
    // Rewrite CSS urls for app.scss
    processUrls: true,
});

mix.sass('src/admin.scss', 'dist');
mix.sass('src/other.scss', 'dist');
```
