# Copying Files


- [Basic Usage](#basic-usage)
    - [Copy a Single File](#copy-a-single-file)
    - [Copy Multiple Files](#copy-multiple-files)
    - [Copy a Directory](#copy-a-directory)
    - [Copy Files With the Given Extension](#copy-files-with-the-given-extension)
    - [Exclude an Extension From Being Copied](#exclude-an-extension-from-being-copied)

### Basic Usage

There might be times when, as part of your build, you need to copy one or more files from one location to another. Mix's `copy()` command makes this a cinch.

#### Copy a Single File

```js
mix.copy('node_modules/foo/bar.css', 'public/css');
```

#### Copy Multiple Files

```js
mix.copy([
    'src/foo/one.css',
    'src/bar/two.css'
], 'public/css');
```

#### Copy a Directory

A common usecase for this is when you wish to move a set of fonts, installed through NPM, to your public directory.

```js
mix.copy('node_modules/vendor/fonts', 'public');
```

If it provides more clarity, `mix.copyDirectory()` is an alias for `mix.copy()`. The following is identical to the previous example.

```js
mix.copyDirectory('node_modules/vendor/fonts', 'public');
```

Please note that, when providing a directory path as the first argument, the output will retain the original directory structure. If you wish to "flatten" it, provide a wildcard search.

```js
mix.copyDirectory('path/to/dir/**', 'public/output');
```

#### Copy Files With the Given Extension

```js
mix.copy('vendor/lib/tests/**/*.php', 'tests');
```

#### Exclude an Extension From Being Copied

```js
mix.copy('tests/**/!(*.js)', 'public/foo');
```

The above will copy all files except for those that end in `.js`.
