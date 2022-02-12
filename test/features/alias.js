import test from 'ava';
import path from 'path';
import { fileURLToPath } from 'url';

import { mix, webpack } from '../helpers/test.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('it handles resolution aliases', async t => {
    mix.alias({
        '@': './foobar'
    });

    const config = await webpack.buildConfig();

    t.deepEqual(config.resolve && config.resolve.alias, {
        '@': path.resolve(__dirname, '../../foobar')
    });
});
