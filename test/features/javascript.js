import test from 'ava';
import path from 'path';

import File from '../../src/File.js';
import { context } from '../helpers/test.js';

test('it applies a rule for js, cjs, mjs, and tsx extensions', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js('js/app.js', 'dist/js');

    const config = await webpack.buildConfig();

    assert()
        .rule(config, rule => rule.test.test('file.js'))
        .exists();
    assert()
        .rule(config, rule => rule.test.test('file.cjs'))
        .exists();
    assert()
        .rule(config, rule => rule.test.test('file.mjs'))
        .exists();
    assert()
        .rule(config, rule => rule.test.test('file.ts'))
        .exists();
    assert()
        .rule(config, rule => rule.test.test('file.tsx'))
        .exists();
});

test.serial('it compiles JavaScript', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();

    assert().manifestEquals({
        '/js/app.js': '/js/app.js'
    });
});

test.serial('it compiles JavaScript with dynamic import', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/dynamic/dynamic.js`, 'js');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/dynamic.js`).exists();

    assert().manifestEquals({
        '/js/absolute.js': '/js/absolute.js',
        '/js/dynamic.js': '/js/dynamic.js',
        '/js/named.js': '/js/named.js'
    });
});

test.serial('it compiles JavaScript and Sass', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js').sass(
        `test/fixtures/app/src/sass/app.scss`,
        'css'
    );

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    assert().file(`test/fixtures/app/dist/css/app.css`).exists();

    assert().manifestEquals({
        '/js/app.js': '/js/app.js',
        '/css/app.css': '/css/app.css'
    });
});

test.serial('basic JS compilation config.', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'js');

    let config = await webpack.buildConfig();

    t.deepEqual(
        {
            '/js/app': [path.resolve('js/app.js')]
        },
        config.entry
    );

    t.deepEqual(
        {
            path: path.resolve(`test/fixtures/app/dist`),
            filename: '[name].js',
            chunkFilename: config.output.chunkFilename,
            hashFunction: 'xxhash64',
            publicPath: '/'
        },
        config.output
    );
});

test.serial(
    'basic JS compilation with output dist directory omitted config.',
    async t => {
        const { mix, webpack } = context(t);

        mix.js('js/app.js', 'js');

        const config = await webpack.buildConfig();

        t.deepEqual(
            {
                '/js/app': [path.resolve('js/app.js')]
            },
            config.entry
        );
    }
);

test('basic JS compilation with a different dist path', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'dist/js').setPublicPath('dist-html');

    let config = await webpack.buildConfig();

    t.deepEqual(
        {
            path: path.resolve('dist-html'),
            filename: '[name].js',
            chunkFilename: config.output.chunkFilename,
            hashFunction: 'xxhash64',
            publicPath: '/'
        },
        config.output
    );
});

test.serial('basic JS compilation with a specific output path config.', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'js/output.js');

    const config = await webpack.buildConfig();

    t.deepEqual(
        {
            '/js/output': [path.resolve('js/app.js')]
        },
        config.entry
    );
});

test('mix.js()', async t => {
    const { mix, Mix } = context(t);

    mix.js('js/app.js', 'dist/js');

    let jsComponent = Mix.components.get('js');

    t.deepEqual(
        [
            {
                entry: [new File('js/app.js')],
                output: new File('dist/js')
            }
        ],
        jsComponent.toCompile
    );

    mix.js(['src/one.js', 'src/two.js'], 'dist/js');

    t.deepEqual(
        [
            {
                entry: [new File('js/app.js')],
                output: new File('dist/js')
            },
            {
                entry: [new File('src/one.js'), new File('src/two.js')],
                output: new File('dist/js')
            }
        ],
        jsComponent.toCompile
    );
});
