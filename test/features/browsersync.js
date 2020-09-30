import mix from './helpers/setup';
import mockRequire from 'mock-require';
import Browsersync from '../../src/components/Browsersync';
import webpack from '../helpers/webpack';

mockRequire(
    'browser-sync-webpack-plugin',
    class BrowserSyncPluginStub {
        apply() {}
    }
);

test('it handles Browsersync reloading', async t => {
    let response = mix.browserSync('app.dev');

    t.is(mix, response);

    let { config } = await webpack.compile();

    t.truthy(
        config.plugins.find(
            plugin => plugin.constructor.name === 'BrowserSyncPluginStub'
        )
    );
});

test('it injects the snippet in the right place', t => {
    let regex = new Browsersync().regex();

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
    t.is(browsersyncConfig().proxy, 'app.test', 'sets default proxy');
    t.is(
        browsersyncConfig('example.domain').proxy,
        'example.domain',
        'sets proxy from string arg'
    );
    t.is(
        browsersyncConfig({ proxy: 'example.other.domain' }).proxy,
        'example.other.domain',
        'sets proxy from user Browsersync config'
    );
});

test('it configures Browsersync server', t => {
    let config = browsersyncConfig({ server: './app' });

    t.is(config.server, './app', 'sets server from user Browsersync config');
    t.is(
        config.proxy,
        undefined,
        'does not set default proxy when using server'
    );
});

let browsersyncConfig = userConfig => {
    let plugin = new Browsersync();

    plugin.register(userConfig);

    return plugin.config();
};
