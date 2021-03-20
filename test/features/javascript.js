import test from 'ava';
import path from 'path';
import File from '../../src/File';
import assert from '../helpers/assertions';
import webpack from '../helpers/webpack';

import { mix, Mix } from '../helpers/mix';

test('it applies a rule for js, cjs, mjs, and tsx extensions', async t => {
    mix.js('js/app.js', 'dist/js');

    let rules = (await webpack.buildConfig()).module.rules;

    t.true(rules.some(rule => rule.test.test('file.js')));
    t.true(rules.some(rule => rule.test.test('file.cjs')));
    t.true(rules.some(rule => rule.test.test('file.mjs')));
    t.true(rules.some(rule => rule.test.test('file.ts')));
    t.true(rules.some(rule => rule.test.test('file.tsx')));
});

test('it compiles JavaScript', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js'
        },
        t
    );
});

test('it compiles JavaScript with dynamic import', async t => {
    mix.js(`test/fixtures/app/src/dynamic/dynamic.js`, 'js');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/dynamic.js`));

    assert.manifestEquals(
        {
            '/js/absolute.js': '/js/absolute.js',
            '/js/dynamic.js': '/js/dynamic.js',
            '/js/named.js': '/js/named.js'
        },
        t
    );
});

test('it compiles JavaScript and Sass', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js').sass(
        `test/fixtures/app/src/sass/app.scss`,
        'css'
    );

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/css/app.css': '/css/app.css'
        },
        t
    );
});

test('basic JS compilation config.', async t => {
    mix.js('js/app.js', 'js');

    let webpackConfig = await webpack.buildConfig();

    t.deepEqual(
        {
            '/js/app': [path.resolve('js/app.js')]
        },
        webpackConfig.entry
    );

    t.deepEqual(
        {
            path: path.resolve(`test/fixtures/app/dist`),
            filename: '[name].js',
            chunkFilename: webpackConfig.output.chunkFilename,
            publicPath: '/'
        },
        webpackConfig.output
    );
});

test('basic JS compilation with output dist directory omitted config.', async t => {
    mix.js('js/app.js', 'js');

    t.deepEqual(
        {
            '/js/app': [path.resolve('js/app.js')]
        },
        (await webpack.buildConfig()).entry
    );
});

test('basic JS compilation with a different dist path', async t => {
    mix.js('js/app.js', 'dist/js').setPublicPath('dist-html');

    let webpackConfig = await webpack.buildConfig();

    t.deepEqual(
        {
            path: path.resolve('dist-html'),
            filename: '[name].js',
            chunkFilename: webpackConfig.output.chunkFilename,
            publicPath: '/'
        },
        webpackConfig.output
    );
});

test('basic JS compilation with a specific output path config.', async t => {
    mix.js('js/app.js', 'js/output.js');

    t.deepEqual(
        {
            '/js/output': [path.resolve('js/app.js')]
        },
        (await webpack.buildConfig()).entry
    );
});

test('mix.js()', t => {
    let response = mix.js('js/app.js', 'dist/js');

    t.deepEqual(mix, response);

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
