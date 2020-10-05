import test from 'ava';

import '../helpers/mix';

test('mix.setResourceRoot()', t => {
    let response = mix.setResourceRoot('some/path');

    t.deepEqual(mix, response);

    t.is('some/path', Config.resourceRoot);
});
