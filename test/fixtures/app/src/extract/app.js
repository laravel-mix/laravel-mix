import 'vue2';
import 'core-js';

new Vue({
    components: {
        VueSplit: () =>
            import(/* webpackChunkName: '/js/split' */ './VueSplit.vue')
    },

    async mounted() {
        const mod = await import('./dynamic');
        mod.default();
    }
}).$mount('#app');
