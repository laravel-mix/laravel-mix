import test from 'ava';
import mix from '../../src/index';
import WebpackConfig from '../../src/builder/WebpackConfig';
import sinon from 'sinon';

test('mix can be extended with new functionality as a callback', t => {
    let registration = sinon.spy();

    mix.extend('foobar', registration);

    let config = new WebpackConfig().build();

    mix.foobar();

    t.true(registration.called);
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

    let config = new WebpackConfig().build();

    mix.foobar('baz');
});

test('dependencies can be requested for download', t => {
    let Verify = require('../../src/Verify');

    Verify.dependency = sinon.spy();

    mix.extend(
        'foobar',
        new class {
            dependencies() {
                return ['some-package'];

                t.pass();
            }

            register() {}
        }()
    );

    let config = new WebpackConfig().build();

    mix.foobar('baz');

    Mix.dispatch('init');

    t.true(Verify.dependency.calledWith('some-package'));
});

test('webpack rules can be added', t => {
    let rule = { test: /\.ext/, loaders: ['stub'] };

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

    let config = new WebpackConfig().build();

    t.deepEqual(rule, config.module.rules.pop());
});

test('webpack plugins can be added', t => {
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

    let config = new WebpackConfig().build();

    t.is(plugin, config.plugins.pop());
});
