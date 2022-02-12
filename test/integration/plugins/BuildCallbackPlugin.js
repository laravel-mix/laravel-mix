import test from 'ava';
import path from 'path';
import sinon from 'sinon';
import { fileURLToPath } from 'url';

import BuildCallbackPlugin from '../../../src/webpackPlugins/BuildCallbackPlugin.js';
import { fs } from '../../helpers/fs.js';
import * as webpack from '../../helpers/webpack.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('that it triggers a callback handler when the Webpack compiler is done', async t => {
    const paths = {
        'src/index.js': path.resolve(__dirname, './tmp/src/index.js'),
        dist: path.resolve(__dirname, './tmp/dist'),
        'dist/main.js': path.resolve(__dirname, './tmp/dist/main.js')
    };

    await fs(t).stub({
        [paths['src/index.js']]: `module.exports = 'index.js';`,
        [paths['dist/main.js']]: ``
    });

    const spy = sinon.spy();

    await webpack.compile({
        entry: [paths['src/index.js']],
        output: { path: paths['dist'] },
        plugins: [new BuildCallbackPlugin(spy)]
    });

    t.true(spy.called);
});
