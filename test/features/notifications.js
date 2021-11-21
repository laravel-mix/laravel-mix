import test from 'ava';

import { assert, mix, webpack } from '../helpers/test.js';

test('it displays OS notifications', async t => {
    const config = await webpack.buildConfig();

    assert(t)
        .webpackPlugin(
            config,
            plugin => plugin.options && plugin.options.alwaysNotify === true
        )
        .exists();
});

test('it disables OS notifications', async t => {
    mix.disableNotifications();

    const config = await webpack.buildConfig();

    assert(t)
        .webpackPlugin(
            config,
            plugin => plugin.options && plugin.options.alwaysNotify === true
        )
        .absent();
});

test('it disables OS success notifications', async t => {
    mix.disableSuccessNotifications();

    const config = await webpack.buildConfig();

    // To disable success notifications, we only have to set the alwaysNotify option on the webpack plugin to false.
    assert(t)
        .webpackPlugin(
            config,
            plugin => plugin.options && plugin.options.alwaysNotify === false
        )
        .exists();
});
