import test from 'ava';
import { context } from '../helpers/test.js';

test('it can version an entire directory or regex of files.', async t => {
    const { mix, fs, webpack, assert } = context(t);

    await fs(t).stub({
        'test/fixtures/app/dist/js/folder/one.js': 'var one',
        'test/fixtures/app/dist/js/folder/two.js': 'var two',
        'test/fixtures/app/dist/js/folder/three.js': 'var thee'
    });

    mix.version(`test/fixtures/app/dist/js/folder`);

    await webpack.compile();

    assert(t).manifestEquals({
        '/js/folder/one.js': '/js/folder/one.js\\?id=\\w{20}',
        '/js/folder/three.js': '/js/folder/three.js\\?id=\\w{20}',
        '/js/folder/two.js': '/js/folder/two.js\\?id=\\w{20}'
    });
});

test('it compiles JavaScript and Sass with versioning', async t => {
    const { mix, fs, webpack, assert } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js')
        .sass(`test/fixtures/app/src/sass/app.scss`, 'css')
        .version();

    await webpack.compile();

    assert(t).manifestEquals({
        '/css/app.css': '/css/app.css\\?id=\\w{20}',
        '/js/app.js': '/js/app.js\\?id=\\w{20}'
    });
});

test('it can build for production with versioning', async t => {
    const { mix, webpack, assert } = context(t);

    mix.options({
        production: true
    });

    t.true(Mix.inProduction());

    mix.js(`test/fixtures/app/src/js/app.js`, 'js').version();

    await webpack.compile();

    assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
});
