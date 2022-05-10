import test from 'ava';
import mockRequire from 'mock-require';

import BrowserSync from '../../src/components/BrowserSync.js';
import MixClass from '../../src/Mix.js';
import { context } from '../helpers/test.js';

mockRequire(
    'browser-sync-webpack-plugin',
    class BrowserSyncPluginStub {
        apply() {}
    }
);

test('it handles Browsersync reloading', async t => {
    const { mix, assert, webpack } = context(t);

    mix.browserSync('app.dev');

    const config = await webpack.buildConfig();

    assert().webpackPlugin(config, 'BrowserSyncPluginStub').exists();
});

test('it injects the snippet in the right place', t => {
    let regex = new BrowserSync(new MixClass()).regex();

    t.is(regex.exec(`<div></div>`), null);
    t.is(regex.exec(`<body></body>`).index, 6);
    t.is(regex.exec(`<BODY></BODY>`).index, 6);
    t.is(regex.exec(`<pre></pre>`).index, 5);
    t.is(regex.exec(`<body><pre></pre></body>`).index, 17);
    t.is(
        regex.exec(`
            <body>
                <pre></pre>
                <div></div>
                <pre></pre>
            </body>
        `).index,
        116
    );
});

test('it configures Browsersync proxy', t => {
    t.is(browserSyncConfig().proxy, `app.test`, 'sets default proxy');
    t.is(
        browserSyncConfig('example.domain').proxy,
        'example.domain',
        'sets proxy from string arg'
    );
    t.is(
        browserSyncConfig({ proxy: 'example.other.domain' }).proxy,
        'example.other.domain',
        'sets proxy from user Browsersync config'
    );
});

test('it configures Browsersync server', t => {
    let config = browserSyncConfig({ server: './app' });

    t.is(config.server, './app', 'sets server from user Browsersync config');
    t.is(config.proxy, undefined, 'does not set default proxy when using server');
});

let browserSyncConfig = userConfig => {
    let plugin = new BrowserSync(new MixClass());

    plugin.register(userConfig);

    return plugin.config();
};
