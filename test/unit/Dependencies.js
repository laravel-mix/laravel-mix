import '../../src/helpers';
import test from 'ava';
import childProcess from 'child_process';
import sinon from 'sinon';
import Dependencies from '../../src/Dependencies';

test.beforeEach(() => {
    console.log = () => {};

    sinon.stub(childProcess, 'execSync');
});

test.afterEach.always(() => {
    childProcess.execSync.restore();
});

test('it installs a single dependency', t => {
    new Dependencies(['browser-sync']).install(false);

    t.true(
        childProcess.execSync.calledWith(
            'npm install browser-sync --save-dev --production=false --legacy-peer-deps'
        )
    );
});

test('it installs multiple dependencies', t => {
    new Dependencies(['browser-sync', 'browser-sync-webpack-plugin']).install(false);

    t.true(
        childProcess.execSync.calledWith(
            'npm install browser-sync browser-sync-webpack-plugin --save-dev --production=false --legacy-peer-deps'
        )
    );
});

test('it can utilize custom checks for a dependency', t => {
    const cmd =
        'npm install postcss@^8.1 --save-dev --production=false --legacy-peer-deps';

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
            check: postcss => {
                called = true;

                t.true(postcss().version.startsWith('8.1'));

                return false;
            }
        }
    ]).install(false);

    t.true(called);
    t.true(childProcess.execSync.calledWith(cmd));
});
