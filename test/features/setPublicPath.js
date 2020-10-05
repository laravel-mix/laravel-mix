import test from 'ava';
import path from 'path';

import '../helpers/mix';

test('mix.setPublicPath()', t => {
    let response = mix.setPublicPath('somewhere/else');

    t.deepEqual(mix, response);

    t.is(path.normalize('somewhere/else'), Config.publicPath);

    // It will also trim any closing slashes.
    mix.setPublicPath('somewhere/else/');

    t.is(path.normalize('somewhere/else'), Config.publicPath);
});
