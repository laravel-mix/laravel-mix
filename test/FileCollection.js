import test from 'ava';
import mockFs from 'mock-fs';
import mix from '../src/index';
import sinon from 'sinon';
import FileCollection from '../src/FileCollection';

test.afterEach(t => mockFs.restore());


test('that it can get the underlying files', t => {
    let files = ['path/to/file.js'];

    t.deepEqual(files, new FileCollection(files).get());
});


test('that it can merge multiple files into one.', t => {
    let files = [
        path.resolve(__dirname, 'one.js'),
        path.resolve(__dirname, 'two.js')
    ];

    mockFs({
        [files[0]]: 'one',
        [files[1]]: 'two',
    });

    let output = new File(path.resolve(__dirname, 'path/to/merged.js'));

    new FileCollection(files).merge(output);

    t.true(File.exists(output.path()));
});


test('that it can merge JS files and apply Babel compilation.', t => {
    let files = [
        path.resolve(__dirname, 'one.js'),
        path.resolve(__dirname, 'two.js')
    ];

    mockFs({
        [files[0]]: 'class Foo {}',
        [files[1]]: 'class Bar {}',
    });

    let collection = new FileCollection(files);

    sinon.stub(collection, 'babelify').callsFake(() => 'fake minified output');

    let output = new File(path.resolve(__dirname, 'path/to/merged.js'));
    let useBabel = true;
    collection.merge(output, useBabel);

    t.true(File.exists(output.path()));
    t.is('fake minified output', output.read());
});
