# JavaScript

-   [Basic Usage](#basic-usage)
-   [TypeScript Support](#typescript-support)

### Basic Usage

```js
mix.js('src/app.js', 'dist/app.js');
```

With a single method call, Laravel Mix allows you to trigger a variety of powerful actions.

-   Compile the [latest JavaScript syntax](https://babeljs.io/docs/en/babel-preset-env).
-   Trigger hot module replacement (via the `npx mix watch --hot` command).
-   Enable tree-shaking (where supported) for smaller builds.
-   Automatically optimizate and minify, when building for production (`npx mix --production`).

```js
let mix = require('laravel-mix');

// 1. Compile src/app.js to dist/app.js
mix.js('src/app.js', 'dist');

// 2. Compile src/app.js to dist/foo.js
mix.js('src/app.js', 'dist/foo.js');

// 3. Merge and compile multiple scripts to dist/app.js
mix.js(['src/app.js', 'src/another.js'], 'dist/app.js');

// 4. Compile src/app.js to dist/app.js and src/forum.js to dist/forum.js
mix.js('src/app.js', 'dist/').js('src/forum.js', 'dist/');
```

### Typescript Support

Laravel Mix also ships with basic Typescript support. Simply update your `mix.js()` call to `mix.ts()`, and then use the exact same set of arguments.

```js
mix.ts('src/app.ts', 'dist');
```

Of course, you'll still want to handle any TypeScript-specific tweeks like creating a `tsconfig.json` file and installing [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped), but everything else should be taken care of.
