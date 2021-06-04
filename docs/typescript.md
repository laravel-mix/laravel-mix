# TypeScript

-   [Basic Usage](#basic-usage)
-   [Example TSConfig](#example-tsconfig)
-   [Usage With Vue](#usage-with-vue)

### Basic Usage

```js
mix.ts('src/app.ts', 'dist');

// Alias
mix.typeScript('src/app.ts', 'dist');
```

TypeScript support in Mix is built on top of the existing `mix.js()` feature set. In fact, it's as simple as updating your `mix.js()` calls to `mix.ts()`. Doing so will trigger the installation of all necessary TypeScript packages, as well as an update to the generated webpack configuration to add the necessary `ts-loader` webpack loader.

### Example TSConfig

Of course, you'll still want to make any appropriate TypeScript-specific tweaks, such as creating a `tsconfig.json` file in your project root, and potentially installing [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped). Here's an example `tsconfig.json` file to get you started.

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["resources/js"]
}
```

[Refer here](https://www.typescriptlang.org/tsconfig/) for a full list of supported options.

### Usage With Vue

Enabling TypeScript compilation within your Vue single file components is a cinch. Begin by updating your `webpack.mix.js` file to specify that you wish to compile TypeScript while also enabling support for Vue single file components.

```js
mix.ts('resources/js/app.js', 'public/js').vue();
```

Next, update your single file component(s) to allow TypeScript to infer types.

##### Using Vue 2

```vue
<script lang="ts">
    // resources/js/components/greet.vue

    // use Vue.extend to enable type inference
    export default Vue.extend({
      data () {
        return {
          message: 'Hello'
        }
      },

      computed: {
        greeting(): string {
          return this.greet() + '!'
        }
      },

      methods: {
        greet(): string {
          return this.message + ' world'
        }
      }
    });
</script>
```

##### Using Vue 3

```vue
<script lang="ts">
    // resources/js/components/greet.vue

    import { defineComponent } from "vue";

    // use defineComponent to enable type inference
    export default defineComponent({
      data () {
        return {
          message: 'Hello'
        }
      },

      computed: {
        greeting(): string {
          return this.greet() + '!'
        }
      },

      methods: {
        greet(): string {
          return this.message + ' world'
        }
      }
    });
</script>
```

And that should do it!
