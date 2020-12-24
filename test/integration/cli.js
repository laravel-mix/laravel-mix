import test from 'ava';
import path from 'path';
import { cli } from '../helpers/cli';

const mix = cli({
    testing: false,
    cwd: path.resolve(__dirname, './fixture')
});

test('It can run the CLI', async t => {
    const { error, stderr } = await mix();

    t.is('', stderr);
    t.is(undefined, error);
});

test('Missing config files result in non-zero exit code', async t => {
    try {
        await mix(['--mix-config=webpack.mix.does-not-exist']);

        t.fail('Mix process exited normally when it should not have.');
    } catch (err) {
        t.not(0, err.code);
    }
});

test('Webpack errors result in non-zero exit code', async t => {
    try {
        await mix(['--mix-config=webpack.mix.error']);

        t.fail('Mix process exited normally when it should not have.');
    } catch (err) {
        t.not(0, err.code);
    }
});
