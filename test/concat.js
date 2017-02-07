import test from 'ava';
import * as mix from '../src/index';
const Mix = mix.config;
import path from 'path';
import File from '../src/File';
import sinon from 'sinon';

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

    Mix.reset();
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


test('that it can combine files while applying versioning', t => {
    mix.combine([one.path(), two.path()], output.path())
       .version();

    Mix.initialize();

    // We'll listen for the "combined" event, so that
    // we can fetch the generated file names.

    // Mix.events.listen('combined', files => generatedFiles = files);
    Mix.events.listen('combined', files => {
        // And then we'll ensure that the manifest contains the
        // output path, as well as the hashed version.
        t.deepEqual({
            [files.outputOriginal]: files.output
        }, Mix.manifest.manifest);
    });

    Mix.concat.run();
});


test('that it applies a .min suffix to minified-only files', t => {
    mix.minify(one.path());

    Mix.concat.run();

    let minified = File.find(path.resolve(__dirname, 'fixtures/one.min.js'));

    t.true(File.exists(minified.path()));

    minified.delete();
});


test('that it determines if there are any added files to combine', t => {
    t.false(Mix.concat.any());

    mix.combine([one.path(), two.path()], output.path());

    t.true(Mix.concat.any());
});


test('that it determines if it should watch for changes', t => {
    let concat = mix.config.concat;

    t.false(concat.shouldWatch());

    // concat.shouldWatch() only returns true if there are
    // registered files to combine, and --watch was passed.
    mix.combine([one.path(), two.path()], output.path());
    t.false(concat.shouldWatch());

    process.argv.push('--watch');
    t.true(concat.shouldWatch());
});


test('that it asks chokidar to watch all relevant files for changes', t => {
    // We'll mock the Chokidar dependency, so that we
    // can apply expectations on how it was called.
    let chokidar = require('chokidar');
    let mock = sinon.mock(chokidar);

    mock.expects('watch')
        .withArgs([one.path(), two.path()])
        .once()
        .returns({ on: () => {} });

    mix.combine(
        [one.path(), two.path()],
        output.path()
    );

    // We need to force the --watch flag, so that
    // the class thinks it should add a watcher.
    process.argv.push('--watch');

    Mix.concat.watch(chokidar);

    mock.verify();
});
