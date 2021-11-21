import test from 'ava';
import sinon from 'sinon';
import { TempSandbox } from 'temp-sandbox';

import BuildCallbackPlugin from '../../../src/webpackPlugins/BuildCallbackPlugin.js';
import webpack from '../../helpers/webpack.js';

const sandbox = new TempSandbox({ randomDir: true });

test.beforeEach(async () => {
    await sandbox.clean();
});

test.after(async () => {
    await sandbox.destroySandbox();
});

test('that it triggers a callback handler when the Webpack compiler is done', async t => {
    const spy = sinon.spy();

    await sandbox.createFile(`src/index.js`, `module.exports = 'index.js';`);

    await webpack.compile({
        entry: sandbox.path.resolve('src/index.js'),
        output: { path: sandbox.path.resolve('dist') },
        plugins: [new BuildCallbackPlugin(spy)]
    });

    t.true(spy.called);
});
