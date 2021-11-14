import test from 'ava';
import Koa from 'koa';
import serveFilesFrom from 'koa-static';
import { chromium } from 'playwright';

import { mix, webpack } from '../helpers/test.js';
import { setupVueAliases } from '../features/vue.js';

/** @type {import("playwright").Browser} */
let browser;

/** @type {import("http").Server} */
let server;

test.before(async () => {
    browser = await chromium.launch();

    const app = new Koa();
    app.use(serveFilesFrom('test/fixtures/integration/dist'));
    server = app.listen(1337);
});

test.after.always(async () => {
    browser && (await browser.close());
    server && server.close();
});

test.beforeEach(() => {
    mix.setPublicPath('test/fixtures/integration/dist');
});

test('compiling just js', async t => {
    // Build a simple mix setup
    await setupVueAliases(3);

    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');
    mix.vue({ extractStyles: 'css/vue-styles.css' });
    mix.react();
    mix.extract();

    await webpack.compile();
    await assertProducesLogs(t, ['loaded: app.js']);
});

test('compiling js and css together', async t => {
    await setupVueAliases(3);

    // Build a simple mix setup
    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');
    mix.react();
    mix.sass('test/fixtures/integration/src/css/app.scss', 'css/app.css');
    mix.postCss('test/fixtures/integration/src/css/app.css', 'css/app.css');
    mix.vue({ extractStyles: 'css/vue-styles.css' });
    mix.extract();

    await webpack.compile();
    await assertProducesLogs(t, [
        'loaded: app.js',
        'run: app.js',
        'loaded: dynamic.js',
        'run: dynamic.js',
        'style: rgb(255, 119, 0)',
        'style: rgb(119, 204, 51)',
        'async component style: rgb(255, 119, 0) rgb(255, 119, 0)'
    ]);
});

test('node browser polyfills: enabled', async t => {
    await setupVueAliases(3);

    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');
    mix.vue({ extractStyles: 'css/vue-styles.css' });
    mix.react();
    mix.extract();

    await webpack.compile();
    await assertProducesLogs(t, [
        'node-polyfill: Buffer function',
        'node-polyfill: Buffer.from function',
        'node-polyfill: process object',
        'node-polyfill: process.env object',
        'node-polyfill: process.env.NODE_ENV string = test'
    ]);
});

test('node browser polyfills: disabled', async t => {
    await setupVueAliases(3);

    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');
    mix.vue({ extractStyles: 'css/vue-styles.css' });
    mix.react();
    mix.extract();
    mix.options({ legacyNodePolyfills: false });

    await webpack.compile();
    await assertProducesLogs(t, [
        'node-polyfill: Buffer undefined',
        'node-polyfill: Buffer.from undefined',
        'node-polyfill: process undefined',
        'node-polyfill: process.env undefined',
        'node-polyfill: process.env.NODE_ENV string = test'
    ]);
});

/**
 * @param {import('ava').ExecutionContext} t
 * @param {string[]} logs
 **/
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

    /** @type Promise<import('playwright').ConsoleMessage | import('playwright').Response | null>[] */
    const events = [];

    events.push(
        ...logs.map(log =>
            page.waitForEvent('console', {
                predicate: msg => msg.text() === log,
                timeout: 1000
            })
        )
    );

    events.push(page.goto(uri));

    await Promise.all(events);

    t.pass();
}
