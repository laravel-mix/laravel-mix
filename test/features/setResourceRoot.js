import test from 'ava';

import { context } from '../helpers/test.js';

test('mix.setResourceRoot()', t => {
    const { mix } = context(t);

    mix.setResourceRoot('some/path');

    t.is('some/path', Mix.config.resourceRoot);
});

test.serial('mix.setResourceRoot() rewrites processed asset urls', async t => {
    const { mix, webpack, assert } = context(t);

    mix.setResourceRoot('https://www.example.com/');
    mix.postCss(`test/fixtures/app/src/css/app-and-image.css`, 'css');

    await webpack.compile();

    assert(t).file(`test/fixtures/app/dist/css/app-and-image.css`).exists();
    assert(t).file(`test/fixtures/app/dist/images/img.svg`).exists();

    assert(t).file(`test/fixtures/app/dist/css/app-and-image.css`).matchesCss(`
        .app {
            color: red;
            background-image: url(https://www.example.com/images/img.svg?66162863e7583212a5d4fd6cdc2426ed);
        }
    `);
});
