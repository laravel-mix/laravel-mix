# Frequently Asked Questions

### Does this tool require that I use Laravel?

No. It has awareness of Laravel, but it can be used for any project. Just be sure to explicitly set the path to your project's `public` or `dist` directory, like so:

```js
mix.setPublicPath('dist');
```

This tells Mix the basic directory where all of your assets should be compiled to.

### My code isn't being minified.

Minification will only be performed when your `NODE_ENV` is set to _production_. By default, this mode is set to development.

```bash
npx mix
```

If you're ready to build for a production environment, add the `--production` flag, like so:

```bash
npx mix --production
```

### I'm using a VM, and webpack isn't picking up my file changes.

If you're running `npx mix` through a VM, you may find that file changes are not picked up by webpack. If that's the case, consider configuring webpack to **poll** your filesystem for changes, like so:

```js
npx mix watch --poll
```

### Why is it saying that an image in my CSS file can't be found in `node_modules`?

Imagine that you have a relative path to an asset that doesn't exist in your `resources/sass/app.scss` file.

```css
body {
    background: url('../img/example.jpg');
}
```

When referencing a relative path, always think in terms of the current file. As such, webpack will look one level up for `resources/assets/img/example.jpg`. If it can't find it, it'll then begin searching for the file location, including within the massive `node_modules` directory. If it still can't be found, you'll receive the error:

```
 ERROR  Failed to compile with 1 errors

This dependency was not found in node_modules:
```

You have two possible solutions:

1. Make sure that `resources/assets/img/example.jpg` exists.
2. Add the following to your `webpack.mix.js` file to disable CSS url() processing.

```
mix.sass('resources/assets/sass/app.scss', 'public/css')
   .options({
        processCssUrls: false
   });
```

This is particularly useful for legacy projects where your folder structure is already exactly as you desire.

### My mix-manifest.json file shouldn't be in the project root.

If you're not using Laravel, your `mix-manifest.json` file will be dumped into the project root. If you need to change this, call `mix.setPublicPath('dist/');`, and your manifest file will now correctly be saved to the `dist` directory.

### Can I autoload modules with Mix and webpack?

Yes. Through its `ProvidePlugin` plugin, webpack allows for this very functionality. A common use-case for this is when we need jQuery to be available to all of your modules. Here's a webpack-specific example of how you might accomplish this.

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

Of course, Mix provides an API on top of webpack to make this sort of autoloading a cinch.

```js
mix.autoload({
    jquery: ['$', 'window.jQuery', 'jQuery'], // more than one
    moment: 'moment' // only one
});
```

Above, we're effectively saying, "When webpack comes across the `$` or `window.jQuery` or `jQuery` symbols, replace it with the exported jQuery module."

### Why am I seeing a "Vue packages version mismatch" error?

If, upon updating your dependencies, your compile fails with the message:

```
Module build failed: Error:

Vue packages version mismatch:

* vue@2.5.13
* vue-template-compiler@2.5.15
```

This means your `vue` and `vue-template-compiler` dependencies are out of sync. Per Vue 2's instructions, the version number for both of these dependencies must be identical. Update as needed to fix the problem:

```
npm update vue

// or

npm install vue@2.5.15
```

### I'm having trouble updating/installing Mix.

Unfortunately, there are countless reasons why your dependencies may not be installing properly. A common root relates to an ancient version of Node (`node -v`) and npm (`npm -v`) installed. As a first step, visit http://nodejs.org and update those.

Otherwise, often, it's related to a faulty lock file that needs to be deleted. Give this series of commands a try to install everything from scratch:

```bash
rm -rf node_modules
rm package-lock.json yarn.lock
npm cache clear --force
npm install
``
```
