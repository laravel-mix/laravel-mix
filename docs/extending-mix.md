# Extending Mix

The very component-based system that Mix uses behind the scenes to build its API is also accessible to you - whether to extend Mix for your own personal projects, or to distribute to the world as a reusable package.

## Example

```js
// webpack.mix.js;
let mix = require('laravel-mix');

mix.extend('foo', function(webpackConfig, ...args) {
    console.log(webpackConfig); // the compiled webpack configuration object.
    console.log(args); // the values passed to mix.foo(); - ['some-value']
});

mix.js('src', 'output').foo('some-value');
```

In the example above, we can see that `mix.extend()` accepts two parameters: the name that should be used when triggering your component, and a callback function or class that registers and organizes the necessary webpack logic. Behind the scenes, Mix will trigger this callback function once the underlying webpack configuration object has been constructed. This will give you a chance to insert or override any settings that are necessary.

While a simple callback function may be useful for quick extensions, in most scenarios, you'll likely want to build a full component class, like so:

```js
mix.extend(
    'foo',
    new class {
        register(val) {
            console.log('mix.foo() was called with ' + val);
        }

        dependencies() {}

        webpackRules() {}

        webpackPlugins() {}

        // ...
    }()
);
```

When extending Mix, you'll typically want to trigger a handful of instructions:

1.  Install _these_ dependencies.
2.  Add this rule/loader to webpack.
3.  Include this webpack plugin.
4.  Override this part of the webpack configuration entirely.
5.  Add this config to Babel.
6.  etc.

Any of these operations are a cinch with Mix's component system.

### The Component Interface

-   **name**: What should be used as the method name, when calling the component. (Defaults to the class name.)
-   **dependencies**: List all npm dependencies that should be installed by Mix.
-   **register**: When your component is called, all user parameters will instantly be passed to this method.
-   **boot**: Boot the component. This method is triggered after the user's webpack.mix.js file has fully loaded.
-   **webpackEntry**: Append to the master Mix webpack entry object.
-   **webpackRules**: Rules to be merged with the master webpack loaders.
-   **webpackPlugins**: Plugins to be merged with the master webpack config.
-   **webpackConfig**: Override the generated webpack configuration.
-   **babelConfig**: Extra Babel config that should be merged with Mix's defaults.

Here's an example/dummy component that will give you a better idea of how you'll construct your own components. For more examples, [refer to the very
components that Mix uses behind the scenes](https://github.com/JeffreyWay/laravel-mix/tree/master/src/components).

```js
class Example {
    /**
     * The optional name to be used when called by Mix.
     * Defaults to the class name, lowercased.
     *
     * Ex: mix.example();
     *
     * @return {String|Array}
     */
    name() {
        // Example:
        // return 'example';
        // return ['example', 'alias'];
    }

    /**
     * All dependencies that should be installed by Mix.
     *
     * @return {Array}
     */
    dependencies() {
        // Example:
        // return ['typeScript', 'ts'];
    }

    /**
     * Register the component.
     *
     * When your component is called, all user parameters
     * will be passed to this method.
     *
     * Ex: register(src, output) {}
     * Ex: mix.yourPlugin('src/path', 'output/path');
     *
     * @param  {*} ...params
     * @return {void}
     *
     */
    register() {
        // Example:
        // this.config = { proxy: arg };
    }

    /**
     * Boot the component. This method is triggered after the
     * user's webpack.mix.js file has executed.
     */
    boot() {
        // Example:
        // if (Config.options.foo) {}
    }

    /**
     * Append to the master Mix webpack entry object.
     *
     * @param  {Entry} entry
     * @return {void}
     */
    webpackEntry(entry) {
        // Example:
        // entry.add('foo', 'bar');
    }

    /**
     * Rules to be merged with the master webpack loaders.
     *
     * @return {Array|Object}
     */
    webpackRules() {
        // Example:
        // return {
        //     test: /\.less$/,
        //     loaders: ['...']
        // });
    }

    /*
     * Plugins to be merged with the master webpack config.
     *
     * @return {Array|Object}
     */
    webpackPlugins() {
        // Example:
        // return new webpack.ProvidePlugin(this.aliases);
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param  {Object} webpackConfig
     * @return {void}
     */
    webpackConfig(webpackConfig) {
        // Example:
        // webpackConfig.resolve.extensions.push('.ts', '.tsx');
    }

    /**
     * Babel config to be merged with Mix's defaults.
     *
     * @return {Object}
     */
    babelConfig() {
        // Example:
        // return { presets: ['@babel/preset-react'] };
    }
}
```

Do note that each of the methods in the example above are optional. In certain situations, your component may only need to add a webpack loader and/or tweak the Babel configuration that Mix uses. No problem. Omit the rest of the interface.

```js
class Example {
    webpackRules() {
        return {
            test: /\.test$/,
            loaders: []
        };
    }
}
```

Now, when Mix constructs the underlying webpack configuration, your rule will be included within the generated `webpackConfig.module.rules` array.

## Usage

Once you've constructed or installed your desired component, simply require it from your `webpack.mix.js` file, and you're all set to go.

```js
// foo-component.js

let mix = require('laravel-mix');

class Example {
    webpackRules() {
        return {
            test: /\.test$/,
            loaders: []
        };
    }
}

mix.extend('foo', new Example());
```

```js
// webpack.mix.js

let mix = require('laravel-mix');
require('./foo-component');

mix.js('src', 'output')
    .sass('src', 'output')
    .foo();
```
