import test from 'ava';

import { mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

test('it returns the mix instance', t => {
    t.deepEqual(mix, mix.disableNotifications());
});

test('it displays OS notifications', async t => {
    let { config } = await webpack.compile();

    // Find the webpack-notifier plugin.
    let plugin = config.plugins.find(
        plugin => plugin.options && plugin.options.alwaysNotify === true
    );

    t.truthy(plugin);
});

test('it disables OS notifications', async t => {
    mix.disableNotifications();

    let { config } = await webpack.compile();

    // Find the webpack-notifier plugin.
    let plugin = config.plugins.find(
        plugin => plugin.options && plugin.options.alwaysNotify === true
    );

    t.falsy(plugin);
});

test('it disables OS success notifications', async t => {
    mix.disableSuccessNotifications();

    let { config } = await webpack.compile();

    // Find the webpack-notifier plugin.
    let plugin = config.plugins.find(
        // To disable success notifications, we only have to set the alwaysNotify
        // option on the webpack plugin to false.
        plugin => plugin.options && plugin.options.alwaysNotify === false
    );

    t.truthy(plugin);
});
