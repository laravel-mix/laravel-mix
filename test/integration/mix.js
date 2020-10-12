import test from 'ava';
import path from 'path';
import { chromium } from 'playwright';
import webpack from '../helpers/webpack';

import '../helpers/mix';

/** @type {import("playwright").Browser} */
let browser;

test.before(async () => {
    browser = await chromium.launch();
});

test.after.always(() => {
    browser && browser.close();
});

test.beforeEach(() => {
    mix.setPublicPath('test/fixtures/integration/dist');
});

test('compiling just js', async t => {
    // Build a simple mix setup
    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');

    await webpack.compile();
    await assertProducesLogs(t, ['loaded: app.js']);
});

test('compiling js and css together', async t => {
    // Build a simple mix setup
    mix.js('test/fixtures/integration/src/js/app.js', 'js/app.js');
    mix.postCss('test/fixtures/integration/src/css/app.css', 'css/app.css');

    await webpack.compile();
    await assertProducesLogs(t, [
        'loaded: app.js',
        'run: app.js',
        'loaded: dynamic.js',
        'run: dynamic.js'
    ]);
});

async function assertProducesLogs(t, logs) {
    const uri = `file://${path.join(
        __dirname,
        '/../fixtures/integration/dist/index.html'
    )}`;

    // Verify in the browser
    const page = await browser.newPage();

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
