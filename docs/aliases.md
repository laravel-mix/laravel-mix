# Aliases

-   [Aliasing Paths](#aliasing-paths)
-   [Aliasing Existing Modules](#aliasing-existing-modules)

Mix offers the ability to configure aliases that get expanded when importing files. It supports aliasing specific paths and whole modules.

### Aliasing Paths

Path aliases are useful when you want to include files from a particular directory but do so from many others without repeatedly writing things like `../file.js` and `../../../file.js`.

Mix can assist in this regard. Consider the following example:

```js
mix.alias({
    '@': path.join(__dirname, 'resources/js')
});
```

This allows one to write `import { useFoo } from "@/Hooks` and it'll be expanded to `import { useFoo } from "/absolute/path/to/your/project/resources/js/Hooks`.

### Aliasing Existing Modules

In addition to aliasing paths you can also alias the definition of an entire module. For example, when importing Vue 3.x we'd prefer to import the ESM bundler version which is more suitable for tree-shaking.

This is acheieved by the following snippet:

```js
mix.alias({
    vue$: path.join(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
});
```

Here's another, more complete example of aliasing a common path and many dependencies to their ESM equivalents (instead of their default CommonJS imports):

```js
mix.alias({
    '@': path.join(__dirname, 'resources/js'),
    d3$: path.join(__dirname, 'node_modules/d3/index.js'),
    vue$: path.join(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js'),
    luxon$: path.join(__dirname, 'node_modules/luxon/src/luxon.js'),
    dompurify$: path.join(
        __dirname,
        'node_modules/dompurify/dist/purify.es.js'
    ),
    easymde$: path.join(__dirname, 'node_modules/easymde/src/js/easymde.js'),
    'billboard.js$': path.join(
        __dirname,
        'node_modules/billboard.js/dist/billboard.esm.js'
    )
});
```
