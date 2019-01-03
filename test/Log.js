import test from 'ava';
import sinon from 'sinon';
import Log from '../src/Log';

sinon.stub(console, 'log');

test('it can log info to the console', t => {
    let message = 'Testing';

    Log.info(message);

    t.true(console.log.calledWith('\x1b[0m', message));
});

test('it can log feedback info to the console', t => {
    let message = 'Testing';

    Log.feedback(message);

    t.true(console.log.calledWith('\x1b[32m', '\t' + message));
});

test('it can log error info to the console', t => {
    let message = 'Testing';

    Log.error(message);

    t.true(console.log.calledWith('\x1b[31m', message));
});

test('it can log a line of info to the console', t => {
    let message = 'Testing';

    Log.line(message, 'green');

    t.true(console.log.calledWith('\x1b[32m', message));
});
