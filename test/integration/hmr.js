import test from 'ava';
import webpack from '../helpers/webpack';
import '../helpers/mix';

test('it configures hot reloading dev server options', async t => {
    mix.options({
        hmr: true
    });

    let { config } = await webpack.compile();
    let devServer = config.devServer;

    t.false(devServer.https);

    t.is('8080', devServer.port);
    t.is('8080', devServer.client.port);

    t.is('localhost', devServer.host);
    t.is('localhost', devServer.client.host);

    t.is('http://localhost:8080/', config.output.publicPath);
    t.is('http://localhost:8080/', devServer.public);
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
    t.is('8080', devServer.client.port);

    t.is('localhost', devServer.host);
    t.is('localhost', devServer.client.host);

    t.is('https://localhost:8080/', config.output.publicPath);
    t.is('https://localhost:8080/', devServer.public);
});
