import test from 'ava';
import path from 'path';
import File from '../../src/File';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it applies a rule for js, cjs, mjs, and tsx extensions', t => {
    mix.js('resources/assets/js/app.js', 'public/js');

    let rules = webpack.buildConfig().module.rules;

    t.true(rules.some(rule => rule.test.test('file.js')));
    t.true(rules.some(rule => rule.test.test('file.cjs')));
    t.true(rules.some(rule => rule.test.test('file.mjs')));
    t.true(rules.some(rule => rule.test.test('file.ts')));
    t.true(rules.some(rule => rule.test.test('file.tsx')));
});

test('it compiles JavaScript', async t => {
    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js'
        },
        t
    );
});

test('it compiles JavaScript with dynamic import', async t => {
    mix.js(`${fakeApp}/resources/assets/dynamic/dynamic.js`, 'js');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/dynamic.js`));

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
    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js').sass(
        `${fakeApp}/resources/assets/sass/app.scss`,
        'css'
    );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.true(File.exists(`${fakeApp}/public/css/app.css`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/css/app.css': '/css/app.css'
        },
        t
    );
});

test('basic JS compilation config.', t => {
    mix.js('resources/assets/js/app.js', 'js');

    let webpackConfig = webpack.buildConfig();

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')]
        },
        webpackConfig.entry
    );

    t.deepEqual(
        {
            path: path.resolve(`${fakeApp}/public`),
            filename: '[name].js',
            chunkFilename: webpackConfig.output.chunkFilename,
            publicPath: '/'
        },
        webpackConfig.output
    );
});

test('basic JS compilation with output public directory omitted config.', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')]
        },
        webpack.buildConfig().entry
    );
});

test('basic JS compilation with a different public path', t => {
    mix.js('resources/assets/js/app.js', 'public/js').setPublicPath(
        'public-html'
    );

    let webpackConfig = webpack.buildConfig();

    t.deepEqual(
        {
            path: path.resolve('public-html'),
            filename: '[name].js',
            chunkFilename: webpackConfig.output.chunkFilename,
            publicPath: '/'
        },
        webpackConfig.output
    );
});

test('basic JS compilation with a specific output path config.', t => {
    mix.js('resources/assets/js/app.js', 'js/output.js');

    t.deepEqual(
        {
            '/js/output': [path.resolve('resources/assets/js/app.js')]
        },
        webpack.buildConfig().entry
    );
});

test('mix.js()', t => {
    let response = mix.js('resources/assets/js/app.js', 'public/js');

    t.deepEqual(mix, response);

    let jsComponent = Mix.components.get('js');

    t.deepEqual(
        [
            {
                entry: [new File('resources/assets/js/app.js')],
                output: new File('public/js')
            }
        ],
        jsComponent.toCompile
    );

    mix.js(
        ['resources/assets/js/one.js', 'resources/assets/js/two.js'],
        'public/js'
    );

    t.deepEqual(
        [
            {
                entry: [new File('resources/assets/js/app.js')],
                output: new File('public/js')
            },
            {
                entry: [
                    new File('resources/assets/js/one.js'),
                    new File('resources/assets/js/two.js')
                ],
                output: new File('public/js')
            }
        ],
        jsComponent.toCompile
    );
});
