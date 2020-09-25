# Upgrade Steps

Because webpack 5 is a massive release with its own set of breaking changes,
it's especially important that you take the time to test your build after upgrading to Mix 6.

```bash
npm install laravel-mix@next
```

# Breaking Changes

Below, you'll find a short list of the most notable Mix changes that you should be aware of. Don't worry: this will only take you a moment to update.

### API for JavaScript Frameworks

Laravel Mix was originally built to be quite opinionated. One of these opinions was that Vue support should be provided out
of the box. Any call to `mix.js()` would instantly come with the benefit of Vue single-file components.

Though we're not removing Vue support by any stretch, we _have_ extracted Vue to its own "featured flag": `mix.vue()`.

##### Before

```js
mix.js('resources/js/app.js', 'public/js');
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').vue();
```

Think of this as your way of saying, "I want to compile my JavaScript **and also** add Vue support."

The same is true for React.

##### Before

```js
mix.react('resources/js/app.js', 'public/js');
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').react();
```

### Vue Configuration Changes

In line with the previous change, any Vue-specific configuration that was stored on the global `Config` object should now
be passed directly to the `mix.vue()` call, like so:

##### Before

```js
mix.js('resources/js/app.js', 'public/js').options({
    extractVueStyles: true,
    globalVueStyles: false
});
```

##### After

```js
mix.js('resources/js/app.js', 'public/js').vue({
    extractStyles: true,
    globalStyles: false
});
```

> Notice the slight property name change: `extractVueStyles` => `extractStyles`.

### Goodbye Node Sass

Previous versions of Mix supported both the Dart and Node bindings for Sass. If we detected that `node-sass` was installed for your project, we'd use it. However, due to the number of issues that surround the `node-sass` implementation, as part of Mix 6, we
will exclusively install and use the Dart-specific version (`sass`).

##### Before

```js
mix.sass('resources/sass/app.sass', 'public/css', {
    implementation: require('node-sass')
});
```

##### After

```js
mix.sass('resources/sass/app.sass', 'public/css');
```

# New Features

-   Support for webpack 5
-   Support for Vue 2 and 3 applications
-   `npx mix` executable
-   **Component:** `mix.alias()`
