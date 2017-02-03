import test from 'ava';
import * as mix from '../src/index';
const Mix = mix.config;
import path from 'path';
import File from '../src/File';

var one, two, output;

test.beforeEach(t => {
    one = new File(
        path.resolve(__dirname, 'fixtures/one.js')
    ).write("var one;");

    two = new File(
        path.resolve(__dirname, 'fixtures/two.js')
    ).write("var two;");

    output = new File(
        path.resolve(__dirname, 'fixtures/combined.js')
    );
});


test.afterEach(t => {
    output.delete();
    one.delete();
    two.delete();

    process.env.NODE_ENV = 'development';
    Mix.concat.files = [];
});


test('that it can combine and minify files', t => {
    mix.combine([one.path(), two.path()], output.path());

    Mix.concat.run();

    t.true(File.exists(output.path()));
    t.is('var one;\nvar two;', output.read());
});


test('that it combines and minifies the output for production environments', t => {
    process.env.NODE_ENV = 'production';

    mix.combine([one.path(), two.path()], output.path());

    Mix.concat.run();

    t.is('var one,two;', output.read());
});

test('that it applies a .min suffix to minified-only files', t => {
    mix.minify(one.path());

    Mix.concat.run();

    let minified = File.find(path.resolve(__dirname, 'fixtures/one.min.js'));

    t.true(File.exists(minified.path()));

    minified.delete();
});
