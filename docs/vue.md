# Vue

-   [Basic Usage](#basic-usage)

Mix ships with support for both Vue 2 and Vue 3 single file components.

### Basic Usage

Support may be activated via the `mix.vue()` command, like so:

```js
mix.js('src/app.js', 'dist').vue();
```

Think of this as a way to request general JavaScript bundling, but _also_ support and awareness of Vue single file components.

The necessary webpack configuration for Vue differs slightly dependent on whether you're using Vue 2 or 3.
Mix will do its best to automatically identify which version you have installed and proceed accordingly. However, you can also explicity set your desired Vue version.

```js
mix.js('src/app.js', 'dist').vue({ version: 2 });
```

Vue's single file components allow you to declare a template, script, and styling within a single file that has a `.vue` extension. Here's an example:

```vue
// src/Alert.vue
<template>
    <div class="alert" v-text="message"></div>
</template>

<script>
export default {
    data() {
        return {
            message: 'I am an alert.'
        };
    }
};
</script>

<style>
.alert {
    background: red;
}
</style>
```

If you're familiar with Vue, this should all look very familiar.

> Otherwise, consider working through the free [Learn Vue: Step By Step](https://laracasts.com/series/learn-vue-2-step-by-step) series at Laracasts.

Assuming your entry script imports this `alert` component...

```js
// src/app.js

import Vue from 'vue';
import Alert from './Alert.vue';

new Vue({
    el: '#app',
    components: { Alert }
});
```

...you can now compile your JavaScript while _also_ including support for Vue files, like so:

```js
// webpack.mix.js

let mix = require('laravel-mix');

mix.js('src/app.js', 'public/js').vue();
```

And that should do it! Run `npx mix` to compile it all down. At this point, the only remaining step is to of course create an HTML file, import the compiled `./js/app.js` script, and refresh the browser.
