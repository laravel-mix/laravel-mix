import test from 'ava';
import mix from '../../src/index';
import WebpackConfig from '../../src/builder/WebpackConfig';
import sinon from 'sinon';
import ComponentFactory from '../../src/ComponentFactory';

new ComponentFactory().installAll();

test('mix can be extended with new functionality as a callback', t => {
    let registration = sinon.spy();

    mix.extend('foobar', registration);

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

    mix.foobar('baz');
});

test('dependencies can be requested for download', t => {
    let Verify = require('../../src/Verify');

    Verify.dependency = sinon.spy();

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

    t.true(Verify.dependency.calledWith('npm-package'));
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
            register() {}

            babelConfig() {
                return { presets: ['react-next'] };
            }
        }()
    );

    mix['reactNext']();

    Mix.dispatch('init');

    t.is('react-next', Config.babel().presets.pop());
});

test('the fully constructed webpack config object is available for modification, if needed', t => {
    mix.extend(
        'extension',
        new class {
            register() {}

            webpackConfig(config) {
                config.stats.hash = true;
            }
        }()
    );

    t.false(new WebpackConfig().build().stats.hash);

    mix.extension();

    Mix.dispatch('init');

    t.true(new WebpackConfig().build().stats.hash);
});
