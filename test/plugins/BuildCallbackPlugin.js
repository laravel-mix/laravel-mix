import test from 'ava';
import webpack from 'webpack';
import { TempSandbox } from 'temp-sandbox';
import BuildCallbackPlugin from '../../src/webpackPlugins/BuildCallbackPlugin';

const sandbox = new TempSandbox({ randomDir: true });

const compile = async options => {
    return new Promise((resolve, reject) => {
        webpack(options, (err, stats) => {
            if (!err && stats.hasErrors()) {
                err = stats.toJson({ errors: true }).errors[0];
            }

            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
};

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
