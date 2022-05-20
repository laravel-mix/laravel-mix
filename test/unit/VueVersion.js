import test from 'ava';
import mockRequire from 'mock-require';

import Mix from '../../src/Mix.js';
import VueVersion from '../../src/VueVersion.js';

test.beforeEach(t => {
    t.context.mix = new Mix();
    t.context.vueVersion = new VueVersion(t.context.mix);
});

test('it detects Vue 2', t => {
    const { vueVersion, mix } = t.context;

    mockRequire('vue2', { version: '2.0' });
    mix.resolver.alias('vue', 'vue2');

    t.is(2, vueVersion.detect());

    mockRequire.stop('vue2');
});

test('it detects Vue 3', t => {
    const { vueVersion, mix } = t.context;

    mockRequire('vue3', { version: '3.0' });
    mix.resolver.alias('vue', 'vue3');

    t.is(3, vueVersion.detect());

    mockRequire.stop('vue3');
});

test('it aborts if Vue is not installed', async t => {
    const { vueVersion, mix } = t.context;

    mix.logger.fake();

    t.throws(() => vueVersion.detect());

    t.true(
        mix.logger.received([
            `Cannot find module 'vue'`,
            `couldn't find a supported version of Vue`
        ])
    );
});

test('it aborts if an unsupported Vue version is provided', t => {
    const { vueVersion, mix } = t.context;

    // TODO: This has to use the name of an actual module because of the switch to require.resolve
    mockRequire('vue3', { version: '100.0' });
    mix.resolver.alias('vue', 'vue3');

    mix.logger.fake();

    t.throws(() => vueVersion.detect(100));

    t.true(mix.logger.received(`couldn't find a supported version of Vue`));

    mockRequire.stop('vue3');
});
