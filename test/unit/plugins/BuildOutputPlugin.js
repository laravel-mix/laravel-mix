import test from 'ava';
import colors from 'colors/safe.js';

import BuildOutputPlugin from '../../../src/webpackPlugins/BuildOutputPlugin.js';

test.beforeEach(() => colors.disable());

test('The build output table renders as expected', async t => {
    const plugin = new BuildOutputPlugin({ clearConsole: true, showRelated: true });

    process.stdout.columns = 80;

    const table = plugin.statsTable({
        assets: [
            { name: 'foo/foo/foo/foo/foo/foo/foo/js/app.js', size: 1200, related: [] },
            { name: 'foo/foo/foo/foo/foo/foo/foo/js/bar.js', size: 1000, related: [] },
            {
                name: 'foo/foo/foo/foo/foo/foo/foo/css/extracted.css',
                size: 1500,
                related: []
            },
            { name: 'foo/foo/foo/foo/foo/foo/foo/css/app.css', size: 1000, related: [] }
        ]
    });

    t.snapshot(`\n${table}\n`);
});
