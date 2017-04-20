# Copying Files

```js
mix.copy(from, to);
mix.copy('from/regex/**/*.txt', to);
mix.copy([path1, path2], to);
mix.copyDirectory(fromDir, toDir);
```

From time to time, you'll want to copy one or more files, as part of your build process. No problem; that's a cinch. Use the mix.copy\(\) method to specify the source file or folder, and then your desired destination.

```js
mix.copy('node_modules/vendor/acme.txt', 'public/js/acme.txt');
```

Upon compilation, the "acme" directory will be moved to `public/js/acme.txt`, accordingly. A common use case for this is when you wish to move a set of fonts, installed through NPM, to your public directory.

