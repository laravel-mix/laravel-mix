import test from 'ava';
import mix from '../src/index';
import sinon from 'sinon';
import ComponentFactory from '../src/components/ComponentFactory';

test.beforeEach(t => {
    Config = require('../src/config')();
    Mix.tasks = [];
});

test('that it knows if it is being executed in a production environment', t => {
    Config.production = true;

    t.true(Mix.inProduction());
});

test('that it can check if a certain config item is truthy', t => {
    Config.versioning = true;

    t.true(Mix.isUsing('versioning'));
});

test('that it knows if it should watch files for changes', t => {
    process.argv.push('--watch');

    t.true(Mix.isWatching());
});

test('that it can dispatch events', t => {
    let callback = sinon.spy();

    Mix.listen('some-event', callback);
    Mix.dispatch('some-event');

    t.true(callback.called);
});

test('that it can dispatch events using a function to determine the data', t => {
    let callback = sinon.spy();

    Mix.listen('some-event', callback);
    Mix.dispatch('some-event', () => 'foo');

    t.true(callback.calledWith('foo'));
});

test('that it can see if we are using a Laravel app', t => {
    t.false(Mix.sees('laravel'));

    new File('./artisan').write('all laravel apps have one');

    t.true(Mix.sees('laravel'));

    // Clean up.
    File.find('./artisan').delete();
});

test('that it detect if hot reloading should be enabled', t => {
    t.false(Mix.shouldHotReload());

    Config.hmr = true;

    t.true(Mix.shouldHotReload());
});

test('that it can add a task', t => {
    Mix.addTask('footask');

    t.is(1, Mix.tasks.length);
});

test('that it can fetch a registered component', t => {
    new ComponentFactory().installAll();

    let component = new class {
        register() {}
    }();

    mix.extend('foo', component);

    mix.foo();

    t.truthy(Mix.components.get('foo'));
    t.deepEqual(component, Mix.components.get('foo'));
});

test('that it can check for an installed npm package', t => {
    t.false(Mix.seesNpmPackage('does-not-exist'));

    t.true(Mix.seesNpmPackage('webpack'));
});
