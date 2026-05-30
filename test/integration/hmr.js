import { createRequire } from 'module';

import test from 'ava';

import { context } from '../helpers/test.js';

test('it configures hot reloading dev server options', async t => {
    const { mix, webpack } = context(t);

    mix.options({
        hmr: true
    });

    const config = await webpack.buildConfig();
    const devServer = config.devServer;

    t.is(devServer.server, undefined);

    t.is('8080', devServer.port);
    t.is('8080', devServer.client.webSocketURL.port);

    t.is('localhost', devServer.host);
    t.is('localhost', devServer.client.webSocketURL.hostname);

    t.is('http://localhost:8080/', config.output.publicPath);
});

test('it configures hot reloading dev server options for https', async t => {
    const { mix, webpack } = context(t);

    mix.options({
        hmr: true,
        hmrOptions: {
            https: true,
            host: 'localhost',
            port: '8080'
        }
    });

    const config = await webpack.buildConfig();
    const devServer = config.devServer;

    t.deepEqual(devServer.server, { type: 'https' });

    t.is('8080', devServer.port);
    t.is('8080', devServer.client.webSocketURL.port);

    t.is('localhost', devServer.host);
    t.is('localhost', devServer.client.webSocketURL.hostname);

    t.is('https://localhost:8080/', config.output.publicPath);
});

test('it registers an /__open-in-editor middleware on the HMR dev server', async t => {
    const { mix, webpack } = context(t);

    mix.options({ hmr: true });

    const config = await webpack.buildConfig();

    // Register independently of the dev server's own built-in open-editor
    // middleware (whose name differs between webpack-dev-server and
    // rspack-dev-server), so an empty input array still yields our endpoint.
    const middlewares = config.devServer.setupMiddlewares([]);
    const openInEditor = middlewares.find(m => m.name === 'mix-open-in-editor');

    t.truthy(openInEditor);
    t.is(openInEditor.path, '/__open-in-editor');
    t.is(typeof openInEditor.middleware, 'function');
});

test('the open-in-editor middleware launches the requested file', async t => {
    const { mix, webpack } = context(t);

    mix.options({ hmr: true });

    const config = await webpack.buildConfig();
    const { middleware } = config.devServer
        .setupMiddlewares([])
        .find(m => m.name === 'mix-open-in-editor');

    // Stub launch-editor through the shared module cache so the test doesn't
    // actually open an editor.
    const require = createRequire(import.meta.url);
    const launchEditor = require.resolve('launch-editor');
    const original = require.cache[launchEditor];
    let openedWith = null;
    require.cache[launchEditor] = {
        id: launchEditor,
        exports: file => (openedWith = file),
        loaded: true
    };

    try {
        let ended = false;
        const res = { setHeader() {}, end: () => (ended = true) };
        middleware({ url: '/__open-in-editor?file=resources/js/App.vue' }, res);

        t.true(ended);
        t.true(openedWith.endsWith('resources/js/App.vue'));

        // Without a file query param it responds with a 500.
        let statusCode = 200;
        const res2 = {
            setHeader() {},
            end() {},
            get statusCode() {
                return statusCode;
            },
            set statusCode(value) {
                statusCode = value;
            }
        };
        middleware({ url: '/__open-in-editor' }, res2);
        t.is(statusCode, 500);
    } finally {
        if (original) {
            require.cache[launchEditor] = original;
        } else {
            delete require.cache[launchEditor];
        }
    }
});
