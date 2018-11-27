import test from 'ava';
import Dispatcher from '../src/Dispatcher';
import sinon from 'sinon';

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
