import test from 'ava';
import path from 'path';

import { mix, Mix } from '../helpers/test.js';

test('mix.setPublicPath()', t => {
    mix.setPublicPath('somewhere/else');

    t.is(path.normalize('somewhere/else'), Mix.config.publicPath);

    // It will also trim any closing slashes.
    mix.setPublicPath('somewhere/else/');

    t.is(path.normalize('somewhere/else'), Mix.config.publicPath);
});
