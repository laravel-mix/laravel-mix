import test from 'ava';

import { context } from '../helpers/test.js';

test('it handles library autoloading', async t => {
    const { mix, webpack, assert } = context(t);

    mix.autoload({
        jquery: ['$', 'window.jQuery'],
        'lodash.map': '_map'
    });

    const config = await webpack.buildConfig();
    const plugin = assert()
        .webpackPlugin(config, /ProvidePlugin/)
        .get() || { definitions: {} };

    t.deepEqual(plugin.definitions, {
        $: 'jquery',
        'window.jQuery': 'jquery',
        _map: ['lodash', 'map']
    });
});
