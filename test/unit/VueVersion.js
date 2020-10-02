import test from 'ava';
import mockRequire from 'mock-require';
import Log from '../../src/Log';
import VueVersion from '../../src/VueVersion';

test('it detects Vue 2', t => {
    mockRequire('vue', { version: '2.0' });

    t.is(2, VueVersion.detect());

    mockRequire.stop('vue');
});

test('it detects Vue 3', t => {
    mockRequire('vue', { version: '3.0' });

    t.is(3, VueVersion.detect());

    mockRequire.stop('vue');
});

test('it aborts if Vue is not installed', t => {
    Log.fake();

    t.throws(() => VueVersion.detect());

    t.true(Log.received(`couldn't find a supported version of Vue`));
});

test('it aborts if an unsupported Vue version is provided', t => {
    mockRequire('vue', { version: '100.0' });

    Log.fake();

    t.throws(() => VueVersion.detect(100));

    t.true(Log.received(`couldn't find a supported version of Vue`));

    mockRequire.stop('vue');
});
