# Laravel Mix Helpers

Though you likely won't need to reference many of these helpers directly, they, nonetheless, are available to you, should you wish to manually configure/modify the provided `webpack.config.js` file.

### `mix.inProduction`

This property may be used to determine the current environment for the build. It simply defers to `process.env.NODE_ENV === 'production'`.

```js
if (mix.inProduction) {
    // Modify webpack.config.js as needed. 
}
```

This can be particularly useful for plugins or tasks that are only necessary for your production-ready build.

### `mix.File`

This property contains a reference to Laravel Mix's `File` class, which includes a number of useful helpers. 

```js
let file = new mix.File('path/to/file.js');
```

On this instance, the following methods are available:

#### File.exists\(\)

```js
let exists = File.exists('path/to/file.js');
```

This static method call will determine if the given file path exists.

#### `file.read()`

```js
let contents = new mix.File('path/to/file.js').read();
```

The `read` method will naturally read and return the file's contents.

#### `file.write()`

```js
new mix.File('path/to/new/file.txt').write('Hello World');
```

The `write` method allows you to write the provided contents to a new file.

#### `file.delete()`

```js
new mix.File('file.js').delete();
```

The `delete` method will unlink/delete the file associated with the current instance.

#### `file.parsePath()`

```js
let segments = new mix.File('file.js').parsePath();
```

This method will parse the provided file into segments. The returned object will contain details of each segment of the path, including the extension, the base directory, the file name, and more.

#### `file.minify()`

```js
new mix.File('file.js').minify();
```

Should you need to manually minify a file \(without using the `mix.minify()` call in your `webpack.mix.js` file\), you may defer to this method.

