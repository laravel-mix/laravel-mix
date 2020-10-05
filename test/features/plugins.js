import test from 'ava';
import path from 'path';
import WebpackConfig from '../../src/builder/WebpackConfig';
import sinon from 'sinon';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('mix can be extended with new functionality as a callback', t => {
    let registration = sinon.spy();

    mix.extend('foobar', registration);

    mix.foobar('baz', 'buzz');

    t.true(registration.calledWith(webpack.buildConfig(), 'baz', 'buzz'));
});

test('mix can be extended with new functionality as a class', t => {
    mix.extend(
        'foobar',
        new class {
            register(val) {
                t.is('baz', val);
            }
        }()
    );

    mix.foobar('baz');
});

test('dependencies can be requested for download', t => {
    let Assert = require('../../src/Assert');

    Assert.dependencies = sinon.spy();

    mix.extend(
        'foobar',
        new class {
            dependencies() {
                return ['npm-package'];
            }

            register() {}
        }()
    );

    mix.foobar();

    Mix.dispatch('init');

    t.true(Assert.dependencies.calledWith(['npm-package']));
});

test('webpack entry may be appended to', t => {
    mix.extend(
        'foobar',
        new class {
            register() {}

            webpackEntry(entry) {
                entry.add('foo', 'path');
            }
        }()
    );

    mix.foobar();

    Mix.dispatch('init');

    t.deepEqual(['path'], new WebpackConfig().build().entry.foo);
});

test('webpack rules may be added', t => {
    let rule = {
        test: /\.ext/,
        loaders: ['example-loader']
    };

    mix.extend(
        'foobar',
        new class {
            register() {}

            webpackRules() {
                return rule;
            }
        }()
    );

    mix.foobar();

    Mix.dispatch('init');

    let config = new WebpackConfig().build();

    t.deepEqual(config.module.rules.pop(), rule);
});

test('webpack plugins may be added', t => {
    let plugin = sinon.stub();

    mix.extend(
        'foobar',
        new class {
            register() {}

            webpackPlugins() {
                return plugin;
            }
        }()
    );

    mix.foobar();

    Mix.dispatch('init');

    let config = new WebpackConfig().build();

    t.is(plugin, config.plugins.pop());
});

test('custom Babel config may be merged', t => {
    mix.extend(
        'reactNext',
        new class {
            babelConfig() {
                return {
                    plugins: ['@babel/plugin-proposal-unicode-property-regex']
                };
            }
        }()
    );

    mix.reactNext();

    webpack.buildConfig();

    t.true(
        Config.babel().plugins.find(plugin =>
            plugin.includes(
                path.normalize('@babel/plugin-proposal-unicode-property-regex')
            )
        ) !== undefined
    );
});

test('the fully constructed webpack config object is available for modification, if needed', t => {
    mix.extend(
        'extension',
        new class {
            register() {}

            webpackConfig(config) {
                config.stats.performance = true;
            }
        }()
    );

    t.false(new WebpackConfig().build().stats.performance);

    mix.extension();

    Mix.dispatch('init');

    t.true(new WebpackConfig().build().stats.performance);
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

    let component = new class {
        register() {
            stub();
        }
    }();

    mix.extend('example', component);

    t.true(stub.notCalled);

    component = new class {
        constructor() {
            this.passive = true;
        }

        register() {
            stub();
        }
    }();

    mix.extend('example', component);

    t.true(stub.called);
});

test('components can manually hook into the mix API', t => {
    let component = new class {
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
    }();

    mix.extend('example', component);

    mix.foo('value');
    mix.baz('anotherValue');
});

test('components can be booted, after the webpack.mix.js configuration file has processed', t => {
    let stub = sinon.spy();

    let component = new class {
        boot() {
            stub();
        }
    }();

    mix.extend('example', component);

    mix.example();

    t.false(stub.called);

    Mix.dispatch('init');

    t.true(stub.called);
});
