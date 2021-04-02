import test from 'ava';

import { mix, Mix } from '../helpers/mix.js';

test('mix.setResourceRoot()', t => {
    let response = mix.setResourceRoot('some/path');

    t.deepEqual(mix, response);

    t.is('some/path', Mix.config.resourceRoot);
});
