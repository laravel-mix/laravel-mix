import '../../src/helpers';
import test from 'ava';
import childProcess from 'child_process';
import sinon from 'sinon';
import semver from 'semver';
import Dependencies from '../../src/Dependencies';
import PackageManager from '../../src/PackageManager';

test.beforeEach(() => {
    console.log = () => {};

    sinon.stub(childProcess, 'execSync');

    PackageManager.detect = () => 'npm';
});

test.afterEach.always(() => {
    childProcess.execSync.restore();
});

test('it installs a single dependency', t => {
    new Dependencies(['browser-sync']).install(false);

    t.true(
        childProcess.execSync.calledWith(
            'npm install browser-sync --save-dev --legacy-peer-deps'
        )
    );
});

test('it installs multiple dependencies', t => {
    new Dependencies(['browser-sync', 'browser-sync-webpack-plugin']).install(false);

    t.true(
        childProcess.execSync.calledWith(
            'npm install browser-sync browser-sync-webpack-plugin --save-dev --legacy-peer-deps'
        )
    );
});

test('it can install dependencies using yarn', t => {
    PackageManager.detect = () => 'yarn';

    new Dependencies(['browser-sync']).install(false);

    t.true(childProcess.execSync.calledWith('yarn add browser-sync --dev'));
});

test('it can install all queued dependencies at once', t => {
    Dependencies.queue(['pkg1', 'pkg2']);
    Dependencies.queue(['pkg3']);
    Dependencies.queue(['pkg4'], true);
    Dependencies.queue('pkg5', true);
    Dependencies.installQueued();

    t.true(
        childProcess.execSync.calledWith(
            'npm install pkg1 pkg2 pkg3 pkg4 pkg5 --save-dev --legacy-peer-deps'
        )
    );
});

test('it can utilize custom checks for a dependency', t => {
    const cmd = 'npm install postcss@^8.1 --save-dev --legacy-peer-deps';

    let called = false;

    new Dependencies([
        {
            package: 'postcss@^8.1',
            check: () => {
                called = true;

                return true;
            }
        }
    ]).install(false);

    t.true(called);
    t.false(childProcess.execSync.calledWith(cmd));

    called = false;

    new Dependencies([
        {
            package: 'postcss@^8.1',
            check: name => {
                called = true;

                t.true(semver.satisfies(require(`${name}/package.json`).version, '^8.1'));

                return false;
            }
        }
    ]).install(false);

    t.true(called);
    t.true(childProcess.execSync.calledWith(cmd));
});
