import test from 'ava';

import { mix } from '../helpers/mix';
import { buildConfig } from '../helpers/webpack';

test('Custom webpack config can be merged', async t => {
    mix.webpackConfig({ context: 'changed' });

    t.is('changed', (await buildConfig()).context);
});

test('Custom webpack config can be merged as a callback function', async t => {
    mix.webpackConfig(webpack => {
        return {
            context: 'changed'
        };
    });

    t.is('changed', (await buildConfig()).context);
});

test('Custom webpack config is called and merged *after* all plugins and extensions', async t => {
    mix.extend('extension', {
        webpackConfig(config) {
            config.foo = 'extension foo';
        }
    });

    mix.extension().webpackConfig(() => {
        return {
            foo: 'webpackConfig foo'
        };
    });

    t.is('webpackConfig foo', (await buildConfig()).foo);
});
