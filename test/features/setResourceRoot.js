import test from 'ava';

import { mix, Mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';
import assert from '../helpers/assertions.js';
import File from '../../src/File.js';

test('mix.setResourceRoot()', t => {
    let response = mix.setResourceRoot('some/path');

    t.deepEqual(mix, response);

    t.is('some/path', Mix.config.resourceRoot);
});

test('mix.setResourceRoot() rewrites processed asset urls', async t => {
    mix.setResourceRoot('https://www.example.com/');
    mix.postCss(`test/fixtures/app/src/css/app-and-image.css`, 'css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/app-and-image.css`));
    t.true(File.exists(`test/fixtures/app/dist/images/img.66162863.svg`));

    assert.fileMatchesCss(
        `test/fixtures/app/dist/css/app-and-image.css`,
        `.app {
            color: red;
            background-image: url(https://www.example.com/images/img.66162863.svg?66162863);
        }`,
        t
    );
});
