import test from 'ava';
import path from 'path';

import { cli } from '../helpers/cli.js';

const mix = cli({
    testing: false,
    env: { NODE_ENV: 'development' },
    cwd: path.resolve(__dirname, './fixture')
});

test('It can run the CLI', async t => {
    const { error, stderr } = await mix();

    t.is('', stderr);
    t.is(null, error);
});

test('Missing config files result in non-zero exit code', async t => {
    const { code } = await mix(['--mix-config=webpack.mix.does-not-exist']);

    t.not(0, code);
});

test('Webpack errors result in non-zero exit code', async t => {
    const { code } = await mix(['--mix-config=webpack.mix.error']);

    t.not(0, code);
});

test('An empty mix file results in a successful build with a warning', async t => {
    const { code, stderr } = await mix(['--mix-config=webpack.mix.empty']);

    t.is(0, code);
    t.regex(stderr, /not set up correctly/i);
});
