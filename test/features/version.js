import test from 'ava';
import { promises as fs } from 'fs';

import assert from '../helpers/assertions.js';
import File from '../../src/File.js';
import webpack from '../helpers/webpack.js';
import { mix, Mix } from '../helpers/mix.js';

test('it can version an entire directory or regex of files.', async t => {
    await fs.mkdir(`test/fixtures/app/dist/js/folder`, { mode: 0o777, recursive: true });

    new File(`test/fixtures/app/dist/js/folder/one.js`).write('var one');
    new File(`test/fixtures/app/dist/js/folder/two.js`).write('var two');
    new File(`test/fixtures/app/dist/js/folder/three.js`).write('var three');

    mix.version(`test/fixtures/app/dist/js/folder`);

    await webpack.compile();

    assert.manifestEquals(
        {
            '/js/folder/one.js': '/js/folder/one.js\\?id=\\w{20}',
            '/js/folder/three.js': '/js/folder/three.js\\?id=\\w{20}',
            '/js/folder/two.js': '/js/folder/two.js\\?id=\\w{20}'
        },
        t
    );
});

test('it compiles JavaScript and Sass with versioning', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js')
        .sass(`test/fixtures/app/src/sass/app.scss`, 'css')
        .version();

    await webpack.compile();

    assert.manifestEquals(
        {
            '/css/app.css': '/css/app.css\\?id=\\w{20}',
            '/js/app.js': '/js/app.js\\?id=\\w{20}'
        },
        t
    );
});

test('it can build for production with versioning', async t => {
    Mix.config.production = true;
    t.true(Mix.inProduction());

    mix.js(`test/fixtures/app/src/js/app.js`, 'js').version();

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
});
