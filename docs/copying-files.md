# Copying Files

```js
mix.copy(from, to, flatten = true);
mix.copyDirectory(fromDir, toDir);
```

From time to time, you'll want to copy one or more files, as part of your build process. No problem; that's a cinch. Use the mix.copy\(\) method to specify the source file or folder, and then your desired destination.

```js
mix.copy('node_modules/vendor/acme.txt', 'public/js/acme.txt');
```

Upon compilation, the "acme" directory will be moved to `public/js/acme.txt`, accordingly. A common use case for this is when you wish to move a set of fonts, installed through NPM, to your public directory.

Note: By default, the output path will be flattened. As such, all files will be copied to the same directory. Alternatively, you may use the `mix.copyDirectory()` to recursively copy an entire directory to a new location. With this method, the original directory structure will be retained.

```js
mix.copyDirectory('node_modules/some/place', 'public/copy/to/here');
```


