# Frequently Asked Questions

### Does this tool require that I use Laravel?

No. It has a few optimizations for Laravel, but it can be used for any project.

### My code isn't being minified.

Minification will only be performed, when your `NODE_ENV` is set to production. Not only will this speed up your compilation time, but it's also unnecessary during development. Here's an example of running Webpack for production.

```bash
export NODE_ENV=production && webpack --progress --hide-modules
```

It's highly recommended that you add the following NPM scripts to your `package.json` file.

```js
"scripts": {
  "dev": "webpack --watch --progress --hide-modules",
  "hmr": "webpack-dev-server --inline --hot",
  "production": "export NODE_ENV=production && webpack --progress --hide-modules"
}
```



