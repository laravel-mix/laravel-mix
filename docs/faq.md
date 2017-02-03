# Frequently Asked Questions

### Does this tool require that I use Laravel?

No. It has a few optimizations for Laravel, but it can be used for any project.

### My code isn't being minified.

Minification will only be performed, when your `NODE_ENV` is set to production. Not only will this speed up your compilation time, but it's also unnecessary during development. Here's an example of running Webpack for production.

```bash
export NODE_ENV=production && webpack --progress --hide-modules
```

It's highly recommended that you add the following NPM scripts to your `package.json` file.

```js
  "scripts": {
    "webpack": "cross-env NODE_ENV=development webpack --progress --hide-modules",
    "dev": "cross-env NODE_ENV=development webpack --watch --progress --hide-modules",
    "hmr": "cross-env NODE_ENV=development webpack-dev-server --inline --hot",
    "production": "cross-env NODE_ENV=production webpack --progress --hide-modules"
  },
```


### I'm using a VM, and Webpack isn't picking up my file changes.

If you're running `npm run dev` through a VM, you may find that file changes are not picked up by Webpack. If that's the case, update your NPM script to use the `--watch-poll` flag, rather than `--watch`. Like this:

```js
"scripts": {
    "dev": "NODE_ENV=development webpack --watch --watch-poll",
  }
```

### My mix-manifest.json file shouldn't be in the project root.

If you're not using Laravel, your `mix-manifest.json` file will be dumped into the project root. If you need to change this, call `mix.setPublicPath('dist/');`, and your manifest file will now be saved in that base directory.

### How Do I autoload modules with Webpack?

Through its `ProvidePlugin` plugin, Webpack allows you to automatically load modules, where needed. A common use-case for this is when we need to pull in jQuery.

```js
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
});

// in a module
$('#item'); // <= just works
jQuery('#item'); // <= just works
// $ is automatically set to the exports of module "jquery"
```

While Laravel Mix automatically loads jQuery for you (exactly as the example above demonstrates), should you need to disable it (by passing an empty object), or override it with your own modules, you may use the `mix.autoload()` method. Here's an example:

```js
mix.autoload({
  jquery: ['$', 'window.jQuery', 'jQuery'], // more than one
  moment: 'moment' // only one
})
```

### Webpack's watcher isn't picking up on my file changes.

[See here for some troubleshooting tips](https://webpack.github.io/docs/troubleshooting.html#webpack-doesn-t-recompile-on-change-while-watching).
