import test from 'ava';
import path from 'path';
import mix from '../src/index';
import ComponentFactory from '../src/components/ComponentFactory';

test.beforeEach(t => {
    Config = require('../src/config')();
    Mix.tasks = [];

    new ComponentFactory().installAll();
});

test('mix.setPublicPath()', t => {
    let response = mix.setPublicPath('somewhere/else');

    t.is(mix, response);

    t.is(path.normalize('somewhere/else'), Config.publicPath);

    // It will also trim any closing slashes.
    mix.setPublicPath('somewhere/else/');

    t.is(path.normalize('somewhere/else'), Config.publicPath);
});

test('mix.setResourceRoot()', t => {
    let response = mix.setResourceRoot('some/path');

    t.is(mix, response);

    t.is('some/path', Config.resourceRoot);
});

test('mix.then()', t => {
    let called = false;

    // mix.then() registers a "build" event listener.
    let response = mix.then(() => (called = true));

    t.is(mix, response);

    // Let's fire a "build" event, and make sure that
    // our callback handler is called, as expected.
    Mix.dispatch('build');

    t.true(called);
});

test('mix.options()', t => {
    mix.options({
        foo: 'bar'
    });

    t.is('bar', Config.foo);
});
