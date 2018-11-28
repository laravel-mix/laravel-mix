import 'vue';
import 'core-js';

new Vue({
    components: {
        VueSplit: () =>
            import(/* webpackChunkName: 'js/split' */ './VueSplit.vue')
    }
}).$mount('#app');
