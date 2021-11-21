import test from 'ava';
import sinon from 'sinon';
import Task from '../../src/tasks/Task.js';
import { fs } from '../helpers/fs.js';
import MixClass from '../../src/Mix.js';

test('that it knows if it is being executed in a production environment', t => {
    const Mix = new MixClass();

    Mix.config.production = true;

    t.true(Mix.inProduction());
    t.true(Mix.api.inProduction());
});

test('that it can check if a certain config item is truthy', t => {
    const Mix = new MixClass();

    Mix.config.processCssUrls = true;

    t.true(Mix.isUsing('processCssUrls'));
});

test('that it knows if it should watch files for changes', t => {
    const Mix = new MixClass();

    process.argv.push('--watch');

    t.true(Mix.isWatching());
});

test('that it can dispatch events', t => {
    const Mix = new MixClass();

    const callback = sinon.spy();

    Mix.listen('some-event', callback);
    Mix.dispatch('some-event');

    t.true(callback.called);
});

test('that it can dispatch events using a function to determine the data', t => {
    const Mix = new MixClass();

    const callback = sinon.spy();

    Mix.listen('some-event', callback);
    Mix.dispatch('some-event', () => 'foo');

    t.true(callback.calledWith('foo'));
});

test('that it can see if we are using a Laravel app', async t => {
    const Mix = new MixClass();

    t.false(Mix.sees('laravel'));

    await fs(t).stub({
        './artisan': 'all laravel apps have one'
    });

    t.true(Mix.sees('laravel'));
});

test('that it can add a task', t => {
    const Mix = new MixClass();

    Mix.addTask(new Task({ foo: 'bar' }));

    t.is(1, Mix.tasks.length);
});

test('that it can fetch a registered component', t => {
    const Mix = new MixClass();
    const mix = Mix.api;

    let component = {
        register() {}
    };

    mix.extend('foo', component);

    // @ts-ignore - there's no way to do declaration merging with JSDoc afaik
    mix.foo();

    t.truthy(Mix.components.get('foo'));
    t.deepEqual(component, Mix.components.get('foo'));
});

test('that it can check for an installed npm package', t => {
    const Mix = new MixClass();

    t.false(Mix.seesNpmPackage('does-not-exist'));

    t.true(Mix.seesNpmPackage('webpack'));
});

test('that it listens for when the webpack configuration object has been fully generated', t => {
    const Mix = new MixClass();
    const mix = Mix.api;

    const spy = sinon.spy();

    mix.override(spy);

    Mix.dispatch('build');
    Mix.dispatch('configReadyForUser');

    t.true(spy.called);
});
