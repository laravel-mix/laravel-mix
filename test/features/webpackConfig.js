import test from 'ava';

import { mix } from '../helpers/mix.js';
import { buildConfig } from '../helpers/webpack.js';

test('Custom webpack config can be merged', async t => {
    mix.webpackConfig({ context: 'changed' });

    t.is('changed', (await buildConfig()).context);
});

test('Custom webpack config can be merged as a callback function', async t => {
    mix.webpackConfig(() => {
        return {
            context: 'changed'
        };
    });

    t.is('changed', (await buildConfig()).context);
});

test('Custom webpack config is called and merged *after* all plugins and extensions', async t => {
    mix.extend('extension', {
        webpackConfig(config) {
            config.externals = ['extension foo'];
        }
    });

    // @ts-ignore - there's no way to do declaration merging with JSDoc afaik
    mix.extension();

    mix.webpackConfig(() => {
        return {
            externals: ['webpackConfig foo']
        };
    });

    t.deepEqual(['extension foo', 'webpackConfig foo'], (await buildConfig()).externals);
});
