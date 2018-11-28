import { map } from 'lodash';

export default {
    render(h) {
        h('div', {
            domProps: {
                innerText: map([1, 2, 3], n => n * 2).join(',')
            }
        });
    }
};
