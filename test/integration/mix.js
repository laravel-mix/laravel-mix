import mix from '../features/helpers/setup';
import { chromium } from 'playwright';

let browser;

test.before(async () => (browser = await chromium.launch()));
test.after.always(() => browser.close());
test.beforeEach(() => {
    mix.setPublicPath('test/fixtures/integration/dist');
});

test.serial('compiling just js', async t => {
    // Build a simple mix setup
    mix.js('test/fixtures/integration/resources/js/app.js', 'js/app.js');

    await compile();
    await assertProducesLogs(t, ['loaded: app.js']);
});

test.serial('compiling js and css together', async t => {
    // Build a simple mix setup
    mix.js('test/fixtures/integration/resources/js/app.js', 'js/app.js');
    mix.postCss(
        'test/fixtures/integration/resources/css/app.css',
        'css/app.css'
    );

    await compile();
    await assertProducesLogs(t, ['loaded: app.js']);
});

async function assertProducesLogs(t, logs) {
    const uri = `file://${path.join(
        __dirname,
        '/../fixtures/integration/index.html'
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
