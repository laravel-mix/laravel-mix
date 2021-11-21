import test from 'ava';
import sinon from 'sinon';

import { assert, mix, Mix, webpack } from '../helpers/test.js';

test('mix can be extended with new functionality as a callback', async t => {
    let registration = sinon.spy();

    mix.extend('foobar', registration);

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar('baz', 'buzz');

    let config = await webpack.buildConfig();

    t.true(registration.calledWith(config, 'baz', 'buzz'));
});

test('mix can be extended with new functionality as a class', t => {
    mix.extend(
        'foobar',
        class {
            /** @param {string} val */
            register(val) {
                t.is('baz', val);
            }
        }
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar('baz');
});

test('mix can be extended with new functionality as a class instance', t => {
    mix.extend(
        'foobar',
        new (class {
            /** @param {string} val */
            register(val) {
                t.is('baz', val);
            }
        })()
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar('baz');
});

test('dependencies can be requested for download', async t => {
    Mix.dependencies.enqueue = sinon.spy();
    Mix.dependencies.install = sinon.spy();

    mix.extend(
        'foobar',
        class {
            dependencies() {
                return ['npm-package'];
            }

            register() {}
        }
    );

    mix.extend(
        'foobar2',
        class {
            dependencies() {
                this.requiresReload = true;

                return ['npm-package2'];
            }

            register() {}
        }
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar();

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar2();

    await Mix.installDependencies();
    await Mix.init();

    t.true(Mix.dependencies.enqueue.calledWith(['npm-package'], false));
    t.true(Mix.dependencies.enqueue.calledWith(['npm-package2'], true));
    t.true(Mix.dependencies.install.called);
});

test('webpack entry may be appended to', async t => {
    mix.extend(
        'foobar',
        class {
            register() {}

            webpackEntry(entry) {
                entry.add('foo', 'path');
            }
        }
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar();

    const config = await webpack.buildConfig();

    t.deepEqual(['path'], config.entry.foo);
});

test('webpack rules may be added', async t => {
    let rule = {
        test: /\.ext/,
        loaders: ['example-loader']
    };

    mix.extend(
        'foobar',
        class {
            register() {}

            webpackRules() {
                return rule;
            }
        }
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar();

    const config = await webpack.buildConfig();

    assert(t)
        .rule(config, aRule => aRule === rule)
        .exists();
});

test('webpack plugins may be added', async t => {
    let plugin = sinon.stub();

    mix.extend(
        'foobar',
        class {
            register() {}

            webpackPlugins() {
                return [plugin];
            }
        }
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.foobar();

    const config = await webpack.buildConfig();

    t.is(plugin, config.plugins.pop());
});

test('the fully constructed webpack config object is available for modification, if needed', async t => {
    mix.extend(
        'extension',
        class {
            register() {}

            webpackConfig(config) {
                config.stats.performance = true;
            }
        }
    );

    let config = await webpack.buildConfig(false);
    t.false(config.stats.performance);

    // @ts-ignore - No declaration merging with JSDoc
    mix.extension();

    config = await webpack.buildConfig(true);
    t.true(config.stats.performance);
});

test('prior Mix components can be overwritten', t => {
    let component = {
        register: sinon.spy()
    };

    mix.extend('foo', component);

    let overridingComponent = {
        register: sinon.spy()
    };

    mix.extend('foo', overridingComponent);

    // @ts-ignore - No declaration merging with JSDoc
    mix.foo();

    t.true(component.register.notCalled);
    t.true(overridingComponent.register.called);
});

test('components can be passive', t => {
    let stub = sinon.spy();

    mix.extend(
        'example',
        class {
            register() {
                stub();
            }
        }
    );

    t.true(stub.notCalled);

    mix.extend(
        'example',
        class {
            constructor() {
                this.passive = true;
            }

            register() {
                stub();
            }
        }
    );

    t.true(stub.called);
});

test('components can manually hook into the mix API', t => {
    mix.extend(
        'example',
        class {
            mix() {
                return {
                    /**
                     * @param {any} arg
                     */
                    foo: arg => {
                        t.is('value', arg);
                    },

                    /**
                     * @param {any} arg
                     */
                    baz: arg => {
                        t.is('anotherValue', arg);
                    }
                };
            }
        }
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.foo('value');

    // @ts-ignore - No declaration merging with JSDoc
    mix.baz('anotherValue');
});

test('components can be booted, after the webpack.mix.js configuration file has processed', async t => {
    let stub = sinon.spy();

    mix.extend(
        'example',
        class {
            boot() {
                stub();
            }
        }
    );

    // @ts-ignore - No declaration merging with JSDoc
    mix.example();

    t.false(stub.called);

    await Mix.init();

    t.true(stub.called);
});

test('can register plugin with anonymous closure', async t => {
    let stub = sinon.spy();

    mix.extend('example', () => stub());

    // @ts-ignore - No declaration merging with JSDoc
    mix.example();

    t.false(stub.called);

    await Mix.init();

    t.false(stub.called);

    await webpack.buildConfig();

    t.true(stub.called);
});
