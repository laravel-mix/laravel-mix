import test from 'ava';
import BuildCallbackPlugin from '../../src/webpackPlugins/BuildCallbackPlugin';

test('that it triggers a callback handler when the Webpack compiler is done', t => {
    let called = false;

    new BuildCallbackPlugin(() => (called = true)).apply(fakeCompiler());

    t.true(called);
});

function fakeCompiler() {
    return {
        plugin(name, callback) {
            callback();
        }
    };
}
