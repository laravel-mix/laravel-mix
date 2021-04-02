import test from 'ava';

import { mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

test('it handles library autoloading', async t => {
    mix.autoload({
        jquery: ['$', 'window.jQuery'],
        'lodash.map': '_map'
    });

    let { config } = await webpack.compile();

    let providePlugin = (config.plugins || []).find(
        plugin => plugin.constructor.name === 'ProvidePlugin'
    ) || { definitions: {} };

    t.deepEqual(providePlugin.definitions, {
        $: 'jquery',
        'window.jQuery': 'jquery',
        _map: ['lodash', 'map']
    });
});
