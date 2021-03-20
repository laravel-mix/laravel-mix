import test from 'ava';
import sinon from 'sinon';

import Dispatcher from '../../src/Dispatcher.js';

test('that it can dispatch events', t => {
    let events = new Dispatcher();
    let handler = sinon.spy();

    events.listen('some-event', handler);
    events.listen('some-event', handler);

    events.fire('some-event', 'foo');

    t.truthy(handler.withArgs('foo').calledTwice);
});

test('that it attach multiple event listeners at once', t => {
    let events = new Dispatcher();
    let handler = sinon.spy();

    events.listen(['some-event', 'another-event'], handler);

    events.fire('some-event', 'foo');
    events.fire('another-event', 'foo');

    t.truthy(handler.withArgs('foo').calledTwice);
});

test('that it errors when sync listners error', async t => {
    let events = new Dispatcher();

    events.listen('foo', () => {
        throw new Error('error');
    });

    await t.throwsAsync(() => events.fire('foo'));
});

test('that it errors when async listners error', async t => {
    let events = new Dispatcher();

    events.listen('foo', async () => {
        throw new Error('error 123');
    });

    await t.throwsAsync(() => events.fire('foo'), { message: 'error 123' });
});
