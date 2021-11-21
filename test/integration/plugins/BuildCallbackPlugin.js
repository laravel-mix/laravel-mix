import test from 'ava';
import sinon from 'sinon';

import { fs, webpack } from '../../helpers/test.js';
import BuildCallbackPlugin from '../../../src/webpackPlugins/BuildCallbackPlugin.js';

test('that it triggers a callback handler when the Webpack compiler is done', async t => {
    const paths = {
        'src/index.js': t.context.disk.join('./tmp/src/index.js'),
        dist: t.context.disk.join('./tmp/dist'),
        'dist/main.js': t.context.disk.join('./tmp/dist/main.js')
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
