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
