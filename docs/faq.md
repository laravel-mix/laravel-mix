# Frequently Asked Questions

### Does this tool require that I use Laravel?

No. It has a few optimizations for Laravel, but it can be used for any project.

### My code isn't being minified.

Minification will only be performed, when your `NODE_ENV` is set to *production*. Not only will this speed up your compilation time, but it's also unnecessary during development. Here's an example of running webpack for production.

```bash
export NODE_ENV=production && webpack --progress --hide-modules
```

It's highly recommended that you add the following NPM scripts to your `package.json` file. Please note that Laravel includes these out of the box.

```js
  "scripts": {
    "dev": "NODE_ENV=development webpack --progress --hide-modules",
    "watch": "NODE_ENV=development webpack --watch --progress --hide-modules",
    "hot": "NODE_ENV=development webpack-dev-server --inline --hot",
    "production": "NODE_ENV=production webpack --progress --hide-modules"
  },
```


### I'm using a VM, and webpack isn't picking up my file changes.

If you're running `npm run dev` through a VM, you may find that file changes are not picked up by webpack. If that's the case, there are two ways to resolve this:

1. Configure webpack to **poll** the filesystem for changes *Note: Polling the filesystem is resource-intensive and will likely shorten battery life on the go.*
2. **Forward** file change notifications to the VM by using something like [vagrant-fsnotify](https://github.com/adrienkohlbecker/vagrant-fsnotify). *Note, this is a [Vagrant](https://www.vagrantup.com)-only plugin.*


To **poll** the VM's filesystem, update your NPM script to use the `--watch-poll` flag, in addition to the `--watch` flag. Like this:

```js
"scripts": {
    "watch": "NODE_ENV=development webpack --watch --watch-poll",
  }
```

To **forward** file change notifications to the VM, simply install [vagrant-fsnotify](https://github.com/adrienkohlbecker/vagrant-fsnotify) on the host machine:

```bash
vagrant plugin install vagrant-fsnotify
```

Now you may [configure](https://github.com/adrienkohlbecker/vagrant-fsnotify#basic-setup) vagrant to use the plugin. In [Homestead](https://laravel.com/docs/5.4/homestead), your `Homestead.yaml` file would look something like this:

```yaml
folders:
    -
        map: /Users/jeffrey/Code/laravel
        to: /home/vagrant/Code/laravel
        options:
            fsnotify: true
            exclude:
                - node_modules
                - vendor
```

Once your vagrant machine is started, simply run `vagrant fsnotify` on the host machine to forward all file changes to the VM. You may then run `npm run watch` inside the VM and have your changes automatically picked up.

If you're still having trouble, [see here for additional troubleshooting tips](https://webpack.github.io/docs/troubleshooting.html#webpack-doesn-t-recompile-on-change-while-watching).

### Why is it saying that an image in my CSS file can't be found in `node_modules`?

Let's imagine that you have a relative path to an asset that doesn't exist in your `resources/assets/sass/app.scss` file.

```css
body {
    background: url('../img/example.jpg');
}
```

When referencing a relative path, always think in terms of the current file. As such, webpack will look for `resources/assets/img/example.jpg`. If it can't find it, it'll then begin searching for the file location, including within `node_modules`. If it still can't be found, you'll receive the error:

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

If you're not using Laravel, your `mix-manifest.json` file will be dumped into the project root. If you need to change this, call `mix.setPublicPath('dist/');`, and your manifest file will now be saved in that base directory.

### How Do I autoload modules with webpack?

Through its `ProvidePlugin` plugin, webpack allows you to automatically load modules, where needed. A common use-case for this is when we need to pull in jQuery.

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

### How might I manually add CoffeeScript compilation?

Very easily! Most of the time, you only need to research the necessary steps for adding X to webpack, and then reference those instructions within the `mix.webpackConfig()` method of your `webpack.mix.js` file. The object you provide to this method will be merged with Mix's default config.

Here's how you might add CoffeeScript support.

```js
// npm install coffee-loader coffee-script

mix.js('resources/assets/js/app.coffee', 'public/js')
   .webpackConfig({
        module: {
            rules: [
                { test: /\.coffee$/, loader: 'coffee-loader' }
            ]
        }
   });

