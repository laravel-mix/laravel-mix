import test from 'ava';
import { TempSandbox } from 'temp-sandbox';
import BuildCallbackPlugin from '../../../src/webpackPlugins/BuildCallbackPlugin';
import { compile } from '../../helpers/webpack';

const sandbox = new TempSandbox({ randomDir: true });

test.beforeEach(async () => await sandbox.clean());
test.after(async () => await sandbox.destroySandbox());

test('that it triggers a callback handler when the Webpack compiler is done', async t => {
    let called = false;

    await sandbox.createFile(`src/index.js`, `module.exports = 'index.js';`);

    await compile({
        entry: sandbox.path.resolve('src/index.js'),
        output: { path: sandbox.path.resolve('dist') },
        plugins: [new BuildCallbackPlugin(() => (called = true))]
    });

    t.true(called);
});
