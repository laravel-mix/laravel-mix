import test from 'ava';

import { context } from '../helpers/test.js';

test.beforeEach(() => {
    process.env.DISABLE_NOTIFICATIONS = '';
});

test('it displays OS notifications', async t => {
    const { webpack, assert } = context(t);

    const config = await webpack.buildConfig();

    assert()
        .webpackPlugin(
            config,
            plugin => plugin.options && plugin.options.alwaysNotify === true
        )
        .exists();
});

test('it disables OS notifications', async t => {
    const { mix, webpack, assert } = context(t);

    mix.disableNotifications();

    const config = await webpack.buildConfig();

    assert()
        .webpackPlugin(
            config,
            plugin => plugin.options && plugin.options.alwaysNotify === true
        )
        .absent();
});

test('it disables OS success notifications', async t => {
    const { mix, webpack, assert } = context(t);

    mix.disableSuccessNotifications();

    const config = await webpack.buildConfig();

    // To disable success notifications, we only have to set the alwaysNotify option on the webpack plugin to false.
    assert()
        .webpackPlugin(
            config,
            plugin => plugin.options && plugin.options.alwaysNotify === false
        )
        .exists();
});
