import { createApp } from 'vue';
import ScssModule from './ScssModule.vue';

async function run() {
    console.log('run: app.js');

    const mod = await import('./dynamic');

    mod.default();
}

export function setupVueApp() {
    const app = createApp({
        components: {
            ScssModule
        },

        setup() {
            run();
        }
    });

    app.mount('#app');
}
