import test from 'ava';
import path from 'path';
import { chromium } from 'playwright';
import webpack, { setupVueAliases } from '../helpers/webpack';
import StaticServer from 'static-server';

import '../helpers/mix';

/** @type {import("playwright").Browser} */
let browser;

/** @type {StaticServer} */
let server;

test.before(async () => {
    browser = await chromium.launch();

    server = new StaticServer({
        rootPath: 'test/fixtures/integration/dist',
        port: 1337
    });

    await new Promise(resolve => server.start(resolve()));
});

test.after.always(() => {
    browser && browser.close();
    server && server.stop();
});

test.beforeEach(() => {
    mix.setPublicPath('test/fixtures/integration/dist');
});

test('compiling just js', async t => {
    // Build a simple mix setup
    setupVueAliases(3);

    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js').vue();

    await webpack.compile();
    await assertProducesLogs(t, ['loaded: app.js']);
});

test('compiling js and css together', async t => {
    setupVueAliases(3);

    // Build a simple mix setup
    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js').vue();
    mix.sass('test/fixtures/integration/src/css/app.scss', 'css/app.css');
    mix.postCss('test/fixtures/integration/src/css/app.css', 'css/app.css');

    await webpack.compile();
    await assertProducesLogs(t, [
        'loaded: app.js',
        'run: app.js',
        'loaded: dynamic.js',
        'run: dynamic.js',
        'style: rgb(255, 119, 0)'
    ]);
});

async function assertProducesLogs(t, logs) {
    const uri = `http://localhost:1337/index.html`;

    // Verify in the browser
    const page = await browser.newPage();

    page.on('request', req => {
        console.log(`[browser request] `, req.url());
    });

    page.on('console', msg =>
        console.log(`[browser console] ${msg.type()}: ${msg.text()}`)
    );

    await Promise.all([
        ...logs.map(log =>
            page.waitForEvent('console', {
                predicate: msg => msg.text() === log,
                timeout: 1000
            })
        ),
        page.goto(uri)
    ]);

    t.pass();
}
