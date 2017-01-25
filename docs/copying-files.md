# Copying Files

```js
mix.copy(from, to, flatten = true);
```

From time to time, you'll want to copy one or more files, as part of your build process. No problem; that's a cinch. Use the mix.copy\(\) method to specify the source file or folder, and then your desired destination.

```js
mix.copy('node_modules/vendor/acme.txt', 'public/js/acme.txt');
```

Upon compilation, the "acme" directory will be moved to `public/js/acme.txt`, accordingly. A common use case for this is when you wish to move a set of fonts, installed through NPM, to your public directory.

> Note: By default, the output path will be flattened. As such, all files will be copied to the same directory. You may disable this as the third argument, should you need Laravel Mix to honor your existing directory tree.
