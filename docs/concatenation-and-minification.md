# Concatenation and Minification

-   [Basic Usage](#basic-usage)
    -   [Concatenate All Files in a Directory](#concatenate-all-files-in-a-directory)
    -   [Concatenate All Matching Files in a Directory](#concatenate-all-matching-files-in-a-directory)
    -   [Concatenate an Array of Files](#concatenate-an-array-of-files)
    -   [Concatenate Scripts and Apply Babel Compilation](#concatenate-scripts-and-apply-babel-compilation)
-   [File Minification](#file-minification)
    -   [Minify a Single File](#minify-a-single-file)
    -   [Minify an Array of File](#minify-an-array-of-file)

Laravel Mix and webpack should take care of all the necessary module bundling and minification for you. However, you may have lingering legacy code or vendor libraries that need to remain separate from your core webpack bundle. Not a problem.

For basic file concatenation and minification, Mix has you covered.

### Basic Usage

Consider the following Mix configuration file.

```js
mix.combine(['one.js', 'two.js'], 'merged.js');
```

This instructs Mix to merge - or concatenate - `one.js` and `two.js` into a single file, called `merged.js`. As always, during development, that merged file will remain uncompressed. However, when building for production, `merged.js` will of course be minified.

> If it reads better to you, `mix.scripts()` and `mix.styles()` are aliases for `mix.combine()`.

#### Concatenate All Files in a Directory

```js
mix.combine('path/to/dir', 'all-files.js');

// or:

mix.scripts('path/to/dir', 'all-files.js');
```

#### Concatenate All Matching Files in a Directory

```js
mix.combine('path/to/dir/*.css', 'all-files.css');

// or:

mix.styles('path/to/dir/*.css', 'all-files.css');
```

#### Concatenate an Array of Files

```js
mix.combine([
    'path/to/dir/*.css',
    'path/to/second/dir/*.css'
], 'all-files.css');
```

#### Concatenate Scripts and Apply Babel Compilation

If you need to concatenate and then compile JavaScript files that have been written with the latest JavaScript syntax, you may either set the third argument of `mix.combine()` to `true`, or instead call `mix.babel()`. Other than the Babel compilation, both commands are identical. 

```js
// Both of these are identical.
mix.combine(['one.js', 'two.js'], 'merged.js', true);                                                     
mix.babel(['one.js', 'two.js'], 'merged.js');
```

### File Minification

Similarly, you may also minify one or more files with the `mix.minify()` command.

There are a few things worth noting here:

1. `mix.minify()` will create a companion `*.min.{extension}` file. So minifying `app.js` will generate `app.min.js` within the same directory.
2. As always, minification will only take place during a production build.
3. There is no need to call `mix.combine(['one.js', 'two.js'], 'merged.js').minify('merged.js');`Just stick with the single `mix.combine()` call. It'll take care of both.

> **Important**: Minification is only available for CSS and JavaScript files. The minifier will not understand any other provided file type.

#### Minify a Single File

```js
mix.minify('path/to/file.js');
```

#### Minify an Array of File

```js
mix.minify(['this/one.js', 'and/this/one.js']);
```

