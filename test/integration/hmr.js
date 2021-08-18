import test from 'ava';

import { mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

test('it configures hot reloading dev server options', async t => {
    mix.options({
        hmr: true
    });

    let { config } = await webpack.compile();
    let devServer = config.devServer;

    t.false(devServer.https);

    t.is('8080', devServer.port);
    t.is('8080', devServer.client.webSocketURL.port);

    t.is('localhost', devServer.host);
    t.is('localhost', devServer.client.webSocketURL.hostname);

    t.is('http://localhost:8080/', config.output.publicPath);
});

test('it configures hot reloading dev server options for https', async t => {
    mix.options({
        hmr: true,
        hmrOptions: {
            https: true,
            host: 'localhost',
            port: '8080'
        }
    });

    let { config } = await webpack.compile();
    let devServer = config.devServer;

    t.true(devServer.https);

    t.is('8080', devServer.port);
    t.is('8080', devServer.client.webSocketURL.port);

    t.is('localhost', devServer.host);
    t.is('localhost', devServer.client.webSocketURL.hostname);

    t.is('https://localhost:8080/', config.output.publicPath);
});
