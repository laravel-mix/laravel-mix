import test from 'ava';
import sinon from 'sinon';

import File from '../../src/File.js';
import Task from '../../src/tasks/Task.js';
import { mix, Mix } from '../helpers/mix.js';

test('that it knows if it is being executed in a production environment', t => {
    Mix.config.production = true;

    t.true(Mix.inProduction());
});

test('that it can check if a certain config item is truthy', t => {
    Mix.config.processCssUrls = true;

    t.true(Mix.isUsing('processCssUrls'));
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

test('that it can add a task', t => {
    Mix.addTask(new Task({ foo: 'bar' }));

    t.is(1, Mix.tasks.length);
});

test('that it can fetch a registered component', t => {
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
    t.false(Mix.seesNpmPackage('does-not-exist'));

    t.true(Mix.seesNpmPackage('webpack'));
});

test('that it listens for when the webpack configuration object has been fully generated', t => {
    let called = false;

    mix.override(() => {
        called = true;
    });

    Mix.dispatch('build');
    Mix.dispatch('configReadyForUser');

    t.true(called);
});
