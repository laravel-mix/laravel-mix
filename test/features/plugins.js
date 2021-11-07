import test from 'ava';
import sinon from 'sinon';

import { mix, Mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

test('mix can be extended with new functionality as a callback', async t => {
    let registration = sinon.spy();

    mix.extend('foobar', registration);

    mix.foobar('baz', 'buzz');

    let config = await webpack.buildConfig();

    t.true(registration.calledWith(config, 'baz', 'buzz'));
});

test('mix can be extended with new functionality as a class', t => {
    mix.extend(
        'foobar',
        new (class {
            register(val) {
                t.is('baz', val);
            }
        })()
    );

    mix.foobar('baz');
});

test('dependencies can be requested for download', async t => {
    let Dependencies = require('../../src/Dependencies');

    Mix.dependencies.enqueue = sinon.spy();
    Mix.dependencies.install = sinon.spy();

    mix.extend(
        'foobar',
        new (class {
            dependencies() {
                return ['npm-package'];
            }

            register() {}
        })()
    );

    mix.extend(
        'foobar2',
        new (class {
            dependencies() {
                this.requiresReload = true;

                return ['npm-package2'];
            }

            register() {}
        })()
    );

    mix.foobar();
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
        new (class {
            register() {}

            webpackEntry(entry) {
                entry.add('foo', 'path');
            }
        })()
    );

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
        new (class {
            register() {}

            webpackRules() {
                return rule;
            }
        })()
    );

    mix.foobar();

    const config = await webpack.buildConfig();

    t.deepEqual(config.module.rules.pop(), rule);
});

test('webpack plugins may be added', async t => {
    let plugin = sinon.stub();

    mix.extend(
        'foobar',
        new (class {
            register() {}

            webpackPlugins() {
                return plugin;
            }
        })()
    );

    mix.foobar();

    const config = await webpack.buildConfig();

    t.is(plugin, config.plugins.pop());
});

test('the fully constructed webpack config object is available for modification, if needed', async t => {
    mix.extend(
        'extension',
        new (class {
            register() {}

            webpackConfig(config) {
                config.stats.performance = true;
            }
        })()
    );

    t.false((await webpack.buildConfig(false)).stats.performance);

    mix.extension();

    t.true((await webpack.buildConfig(true)).stats.performance);
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

    mix.foo();

    t.true(component.register.notCalled);
    t.true(overridingComponent.register.called);
});

test('components can be passive', t => {
    let stub = sinon.spy();

    let component = new (class {
        register() {
            stub();
        }
    })();

    mix.extend('example', component);

    t.true(stub.notCalled);

    component = new (class {
        constructor() {
            this.passive = true;
        }

        register() {
            stub();
        }
    })();

    mix.extend('example', component);

    t.true(stub.called);
});

test('components can manually hook into the mix API', t => {
    let component = new (class {
        mix() {
            return {
                foo: arg => {
                    t.is('value', arg);
                },

                baz: arg => {
                    t.is('anotherValue', arg);
                }
            };
        }
    })();

    mix.extend('example', component);

    mix.foo('value');
    mix.baz('anotherValue');
});

test('components can be booted, after the webpack.mix.js configuration file has processed', async t => {
    let stub = sinon.spy();

    let component = new (class {
        boot() {
            stub();
        }
    })();

    mix.extend('example', component);

    mix.example();

    t.false(stub.called);

    await Mix.init();

    t.true(stub.called);
});
