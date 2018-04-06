import '../src/helpers';
import test from 'ava';
import process from 'child_process';
import sinon from 'sinon';
import Dependencies from '../src/Dependencies';
import File from '../src/File';

test.beforeEach(() => {
    console.log = () => {};

    sinon.stub(process, 'execSync');
});

test.afterEach.always(() => {
    process.execSync.restore();
});

test('it installs a single dependency', t => {
    new Dependencies(['browser-sync']).install();

    t.true(process.execSync.calledWith('npm install browser-sync --save-dev'));
});

test('it installs multiple dependencies', t => {
    new Dependencies(['browser-sync', 'browser-sync-webpack-plugin']).install();

    t.true(
        process.execSync.calledWith(
            'npm install browser-sync browser-sync-webpack-plugin --save-dev'
        )
    );
});

test('it installs a single dependency with Yarn', t => {
    sinon.stub(File, 'exists').returns(true);

    new Dependencies(['browser-sync']).install();

    t.true(process.execSync.calledWith('yarn add browser-sync --dev'));
});


