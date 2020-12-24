import { createApp } from 'vue';
import ScssModule from './ScssModule.vue';
import './node-browser-polyfills';

console.log('loaded: app.js');

async function run() {
    console.log('run: app.js');

    const mod = await import('./dynamic');

    mod.default();
}

const app = createApp({
    components: {
        ScssModule
    },

    setup() {
        run();
    }
});

app.mount('#app');
