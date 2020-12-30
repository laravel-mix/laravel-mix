import test, { beforeEach } from 'ava';
import colors from 'colors/safe';
import BuildOutputPlugin from '../../../src/webpackPlugins/BuildOutputPlugin';

beforeEach(() => colors.disable());

test('The build output table renders as expected', async t => {
    const plugin = new BuildOutputPlugin({ clearConsole: true });

    process.stdout.columns = 80;

    const table = plugin.statsTable({
        assets: [
            { name: 'foo/foo/foo/foo/foo/foo/foo/js/app.js', size: 1200 },
            { name: 'foo/foo/foo/foo/foo/foo/foo/js/bar.js', size: 1000 },
            { name: 'foo/foo/foo/foo/foo/foo/foo/css/extracted.css', size: 1500 },
            { name: 'foo/foo/foo/foo/foo/foo/foo/css/app.css', size: 1000 }
        ]
    });

    t.snapshot(`\n${table}\n`);
});
