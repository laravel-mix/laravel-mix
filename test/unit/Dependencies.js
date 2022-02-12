import test from 'ava';
import childProcess from 'child_process';
import semver from 'semver';
import sinon from 'sinon';

import Dependencies from '../../src/Dependencies.js';
import PackageManager from '../../src/PackageManager.js';
import { createRequire } from 'module';

/** @type {sinon.SinonStub<Parameters<childProcess.exec>>} */
let exec;

test.beforeEach(() => {
    PackageManager.detect = () => 'npm';
    console.log = () => {};

    exec = sinon.stub(childProcess, 'exec').yields(undefined);
});

test.afterEach.always(() => exec.restore());

test.serial('it installs a single dependency', async t => {
    const dependencies = new Dependencies();

    await dependencies.enqueue(['browser-sync']).install();

    assertRanCommand(t, 'npm install browser-sync --save-dev --legacy-peer-deps');
});

test.serial('it installs multiple dependencies', async t => {
    const dependencies = new Dependencies();

    await dependencies.enqueue(['browser-sync', 'browser-sync-webpack-plugin']).install();

    assertRanCommand(
        t,
        'npm install browser-sync browser-sync-webpack-plugin --save-dev --legacy-peer-deps'
    );
});

test.serial('it can install dependencies using yarn', async t => {
    const dependencies = new Dependencies();

    PackageManager.detect = () => 'yarn';

    await dependencies.enqueue(['browser-sync']).install();

    assertRanCommand(t, 'yarn add browser-sync --dev');
});

test.serial('it can install all queued dependencies at once', async t => {
    const dependencies = new Dependencies();

    dependencies.enqueue(['pkg1', 'pkg2']);
    dependencies.enqueue(['pkg3']);
    dependencies.enqueue(['pkg4'], true);
    dependencies.enqueue(['pkg5'], true);
    await dependencies.install();

    assertRanCommand(
        t,
        'npm install pkg1 pkg2 pkg3 pkg4 pkg5 --save-dev --legacy-peer-deps'
    );
});

test.serial('it can utilize custom checks for a dependency: false', async t => {
    const dependencies = new Dependencies();

    const cmd = 'npm install postcss@^8.1 --save-dev --legacy-peer-deps';

    const stub = sinon.stub().returns(true);

    dependencies.enqueue([
        {
            package: 'postcss@^8.1',
            check: stub
        }
    ]);

    await dependencies.install();

    t.true(stub.called);
    t.false(exec.calledWith(cmd, sinon.match.func));
});

test.serial('it can utilize custom checks for a dependency: true', async t => {
    const dependencies = new Dependencies();

    const cmd = 'npm install postcss@^8.1 --save-dev --legacy-peer-deps';

    const spy = sinon.spy();
    const require = createRequire(import.meta.url);

    dependencies.enqueue([
        {
            package: 'postcss@^8.1',
            check: name => {
                spy();

                t.true(semver.satisfies(require(`${name}/package.json`).version, '^8.1'));

                return false;
            }
        }
    ]);

    await dependencies.install();

    t.true(spy.called);
    assertRanCommand(t, cmd);
});

/**
 *
 * @param {import('ava').Assertions} t
 * @param {string} command
 */
function assertRanCommand(t, command) {
    t.true(exec.calledWith(command));
}
