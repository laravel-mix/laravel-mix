import 'vue2';
import BasicWithCss from './BasicWithCss.vue';

Vue.component('AsyncComponent', () =>
    import(
        /* webpackChunkName: "async-component" */
        './AsyncComponent.vue'
    )
);

new Vue({
    components: {
        BasicWithCss
    }
}).$mount('#app');
