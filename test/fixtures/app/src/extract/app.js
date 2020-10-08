import 'core-js';
import Vue from 'vue2';
import { uniq } from 'lodash';
import { auto } from 'eol';

new Vue({
    components: {
        VueSplit: () =>
            import(/* webpackChunkName: '/js/split' */ './VueSplit.vue')
    },

    created() {
        uniq(['foo', 'bar', 'foo']);
        auto('foo\nbar');
    }
}).$mount('#app');
