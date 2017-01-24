# JavaScript

```js
mix.js(src|[src], output)
```

With a single line of code, Laravel Mix allows you to trigger a number of vital actions.

* ES2015 + modules compilation
* Build and compile `.vue` components \(via `vue-loader`\)
* Hot module replacement
* Tree-shaking, new in Webpack 2 \(removes unused library code\)
* Extract vendor libraries \(via `mix.extract()`\), for improved long-term caching
* Automatic versioning \(file hashing\), via `mix.vendor()`


### Usage

```js
let mix = require('laravel-mix');

// 1. A single src and output path.
mix.js('src/app.js', 'dist/app.js');


// 2. For additional src files that should be
// bundled together:
mix.js([
    'src/app.js',
    'src/another.js'
], 'dist/app.js');


// 3. For multiple entry/output points:
mix.js('src/app.js', 'dist/')
   .js('src/forum.js', 'dist/');
```

##### Important Note

Please note that Laravel Mix requires you to perform some form of Javascript bundling. As such, at least one call to `mix.js` within your `webpack.mix.js` file is mandatory.

### Laravel Example

Consider a typical Laravel install. By default, your JavaScript entry point will be located at `./resources/assets/js/app.js`. Let's prepare a `webpack.mix.js` file to compile that to `./public/js/app.js`.

```js
let mix = require('laravel-mix');

mix.js('resources/assets/js/app.js', 'public/js');
```

Done! Now, all of the bullet items above are available to you, and it required exactly one method call.

To trigger the compilation, run `node_modules/.bin/webpack` from the command line.

### Vue Components

Laravel Mix is mildly opinionated, and ships with compilation support for `.vue` component files. Don't worry: if you don't use Vue, you can ignore this entire section.

Single file components are one of Vue's neatest features. One file to declare the template, script, and styling for a component? Yes, please! Let's try it out.

##### ./resources/assets/js/app.js

```js
import Vue from 'vue';
import Notification from './components/Notification.vue';

new Vue({
    el: '#app',
    components: { Notification }
});
```

Above, we import Vue \(you'll want to first run `npm install vue --save-dev`\), require a `Notification` Vue component, and then build up our root Vue instance.

**./resources/assets/js/components/Notification.vue**

```js
<template>
    <div class="notification">
        {{ body }}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                body: 'I am a notification.'
            }
        }
    }
</script>

<style>
    .notification {
        background: grey;
    }
</style>
```

If you're familiar with Vue, this should all look very familiar, so we'll move on.

**./webpack.mix.js**

```js
let mix = require('laravel-mix');

mix.js('resources/assets/js/app.js', 'public/js');
```

And that should do it! Run `node_modules/.bin/webpack` to compile it all down. At this point, simply create an HTML file, import your `./js/app.js` bundle, and load the browser. Tada!
