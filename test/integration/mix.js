import test from 'ava';
import Koa from 'koa';
import serveFilesFrom from 'koa-static';
import { chromium } from 'playwright';

import { context } from '../helpers/test.js';
import { setupVueAliases } from '../features/vue.js';

/**
 * @template  MetadataType
 * @typedef {import('../helpers/TestContext.js').TestContext<MetadataType>} TestContext<MetadataType>
 **/

/**
 * @typedef {object} TestContextMetadata
 * @property {number} port
 * @property {import('http').Server|null} server
 * @property {string[]} logEvents
 */

/** @type {import("playwright").Browser} */
let browser;

let port = 1337;

// Setup the browser used by all tests
test.serial.before(async () => (browser = await chromium.launch()));
test.serial.after.always(async () => {
    if (browser) {
        await browser.close();
    }
});

// Setup the server used by individual tests
test.serial.beforeEach(async t => {
    /** @type {TestContext<TestContextMetadata>} */
    const { disk, metadata } = context(t, {
        port: port++,
        server: null,
        logEvents: []
    });

    const serveFromDisk = serveFilesFrom(disk.join('test/fixtures/integration/dist'));

    metadata.server = new Koa().use(serveFromDisk).listen(metadata.port);
});

test.serial.afterEach.always(async t => {
    /** @type {TestContext<TestContextMetadata>} */
    const { metadata } = context(t, {
        port: port++,
        server: null,
        logEvents: []
    });

    if (metadata.server) {
        await metadata.server.close();
    }
});

test.serial.beforeEach(t => {
    /** @type {TestContext<TestContextMetadata>} */
    const { mix, metadata } = context(t);

    metadata.logEvents = [];
    mix.setPublicPath('test/fixtures/integration/dist');
});

test.serial.afterEach.always(t => {
    if (t.passed) {
        return;
    }

    /** @type {TestContext<TestContextMetadata>} */
    const { metadata } = context(t);

    metadata.logEvents.forEach(log => console.log(log));
});

test.serial('compiling just js', async t => {
    const { mix, Mix, webpack } = context(t);

    // Build a simple mix setup
    await setupVueAliases(3, Mix);

    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');
    mix.vue({ extractStyles: 'css/vue-styles.css' });
    mix.react();
    mix.extract();

    await webpack.compile();
    await assertProducesLogs(t, ['loaded: app.js']);
});

test.serial('compiling js and css together', async t => {
    const { mix, Mix, webpack } = context(t);

    await setupVueAliases(3, Mix);

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

test.serial('node browser polyfills: enabled', async t => {
    const { mix, Mix, webpack } = context(t);

    await setupVueAliases(3, Mix);

    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');
    mix.vue({ extractStyles: 'css/vue-styles.css' });
    mix.react();
    mix.extract();
    mix.options({ legacyNodePolyfills: true });

    await webpack.compile();
    await assertProducesLogs(t, [
        'node-polyfill: Buffer function',
        'node-polyfill: Buffer.from function',
        'node-polyfill: process object',
        'node-polyfill: process.env object',
        'node-polyfill: process.env.NODE_ENV string = test'
    ]);
});

test.serial('node browser polyfills: disabled', async t => {
    const { mix, Mix, webpack } = context(t);

    await setupVueAliases(3, Mix);

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
    /** @type {TestContext<TestContextMetadata>} */
    const { metadata } = context(t);

    const uri = `http://localhost:${metadata.port}/index.html`;

    // Verify in the browser
    const page = await browser.newPage();

    page.on('request', req => metadata.logEvents.push(`[browser request] ${req.url()}`));
    page.on('console', msg =>
        metadata.logEvents.push(`[browser console] ${msg.type()}: ${msg.text()}`)
    );

    /** @type Promise<import('playwright').ConsoleMessage | import('playwright').Response | null>[] */
    const events = [];

    events.push(
        ...logs.map(log =>
            page.waitForEvent('console', {
                predicate: msg => msg.text() === log,
                timeout: 10000
            })
        )
    );

    events.push(page.goto(uri));

    await Promise.all(events);

    t.pass();
}
