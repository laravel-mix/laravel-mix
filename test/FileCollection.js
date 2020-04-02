import test from 'ava';
import mix from '../src/index';
import sinon from 'sinon';
import FileCollection from '../src/FileCollection';
import fs from 'fs-extra';
import eol from 'eol';

let stubsDir = path.resolve(__dirname, 'stubs');

test.before(t => fs.ensureDirSync(stubsDir));

test.afterEach(t => {
    fs.emptyDirSync(stubsDir);
});

test('that it can get the underlying files', t => {
    let files = ['path/to/file.js'];

    t.deepEqual(files, new FileCollection(files).get());
});

test.cb('that it can merge multiple files into one.', t => {
    let files = [
        path.resolve(stubsDir, 'one.js'),
        path.resolve(stubsDir, 'two.js')
    ];

    new File(files[0]).write('class Foo {}');
    new File(files[1]).write('class Bar {}');

    let output = new File(path.resolve(stubsDir, 'merged.js'));

    new FileCollection(files).merge(output).then(() => {
        t.true(File.exists(output.path()));
        t.is('class Foo {}\n\nclass Bar {}\n', eol.lf(output.read()));
        t.end();
    });
});

test.cb('that it can merge JS files and apply Babel compilation.', t => {
    let files = [
        path.resolve(stubsDir, 'one.js'),
        path.resolve(stubsDir, 'two.js')
    ];

    new File(files[0]).write('class Foo {}');
    new File(files[1]).write('class Bar {}');

    let collection = new FileCollection(files);

    sinon.stub(collection, 'babelify').callsFake(() => 'fake minified output');

    let output = new File(path.resolve(stubsDir, 'merged.js'));
    let useBabel = true;
    collection.merge(output, useBabel).then(() => {
        t.true(File.exists(output.path()));
        t.is(eol.auto('fake minified output\n'), output.read());
        t.end();
    });
});

test.cb("that it throw an error if a file doesn't exist.", t => {
    let files = [path.resolve(stubsDir, 'fileThatDoesntExist.js')];
    let output = new File(path.resolve(stubsDir, 'merged.js'));
    let mergeFiles = () => new FileCollection(files).merge(output);
    let expectedMessage = `ENOENT: no such file or directory, open '${
        files[0]
    }'`;

    t.throwsAsync(mergeFiles(), expectedMessage).then(() => {
        t.false(File.exists(output.path()));
        t.end();
    });
});
