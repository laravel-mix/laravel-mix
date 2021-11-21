import test from 'ava';
import mockRequire from 'mock-require';

import Log from '../../src/Log.js';
import Mix from '../../src/Mix.js';
import VueVersion from '../../src/VueVersion.js';

let mix = new Mix();
let vueVersion = new VueVersion(mix);

test.beforeEach(() => mix.resolver.clear());
test.afterEach(() => mix.resolver.clear());

test('it detects Vue 2', t => {
    mockRequire('vue2', { version: '2.0' });
    mix.resolver.alias('vue', 'vue2');

    t.is(2, vueVersion.detect());

    mockRequire.stop('vue2');
});

test('it detects Vue 3', t => {
    mockRequire('vue3', { version: '3.0' });
    mix.resolver.alias('vue', 'vue3');

    t.is(3, vueVersion.detect());

    mockRequire.stop('vue3');
});

test('it aborts if Vue is not installed', async t => {
    Log.fake();

    t.throws(() => vueVersion.detect());

    t.true(Log.received(`couldn't find a supported version of Vue`));
});

test('it aborts if an unsupported Vue version is provided', t => {
    // TODO: This has to use the name of an actual module because of the switch to require.resolve
    mockRequire('vue3', { version: '100.0' });
    mix.resolver.alias('vue', 'vue3');

    Log.fake();

    t.throws(() => vueVersion.detect(100));

    t.true(Log.received(`couldn't find a supported version of Vue`));

    mockRequire.stop('vue3');
});
