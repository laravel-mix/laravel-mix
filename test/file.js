import test from 'ava';
import path from 'path';
import File from '../src/File';
import sinon from 'sinon';

test('that it parses a path into segments', t => {
    let file = new File('some/path/to/a/file.txt');

    t.deepEqual(file.parsePath(), {
        path: 'some/path/to/a/file.txt',
        pathWithoutExt: 'some/path/to/a/file',
        hashedPath: 'some/path/to/a/file.[hash].txt',
        base: 'some/path/to/a',
        file: 'file.txt',
        hashedFile: 'file.[hash].txt',
        name: 'file',
        isDir: false,
        ext: '.txt'
    });
});


test('that it minifies JS and CSS files properly.', t => {
    let dummyJsFilePath = path.resolve(__dirname, 'dummy.js');
    let dummyCssFilePath = path.resolve(__dirname, 'dummy.css');

    let jsCodeToMinify = new File(path.resolve(__dirname, 'fixtures/minifyme.js')).read();
    let cssCodeToMinify = new File(path.resolve(__dirname, 'fixtures/minifyme.css')).read();
    let jsCodeMinified = new File(path.resolve(__dirname, 'fixtures/minifyme.min.js')).read();
    let cssCodeMinified = new File(path.resolve(__dirname, 'fixtures/minifyme.min.css')).read();

    let dummyJsFile = new File(dummyJsFilePath).write(jsCodeToMinify);
    let dummyCssFile = new File(dummyCssFilePath).write(cssCodeToMinify);

    dummyJsFile.minify();
    t.is(dummyJsFile.read(), jsCodeMinified);

    dummyCssFile.minify();
    t.is(dummyCssFile.read(), cssCodeMinified);

    dummyJsFile.delete();
    dummyCssFile.delete();
});


test('that it can rename a file', t => {
    let before = path.resolve(__dirname, 'before.js');
    let after = path.resolve(__dirname, 'after.js');

    let file = new File(before).write('');

    file.rename(after);

    t.true(File.exists(file.path()));

    file.delete();
});


test('that it can create a duplicated, versioned file.', t => {
    let file = new File(path.resolve(__dirname, 'file.txt')).write('foo');

    let versionedFile = file.version();

    t.true(File.exists(versionedFile.file));
    t.is('foo', versionedFile.read());

    // Clean up
    file.delete();
    versionedFile.delete();
});


test('that it fetches the versioned file path', t => {
    let versionedPath = new File('path/to/file.js').versionedPath('hash-stub');

    t.is('path/to/file.hash-stub.js', versionedPath);
});


test('that it watches a file changes', t => {
    let file = new File(path.resolve(__dirname, 'stub.txt'));

    // If we watch the file, and then immediately
    // force the "change" event...
    let callback = sinon.spy();
    file.watch(callback).emit('change');

    // Then our callback function should be triggered.
    t.true(callback.called);

    // Clean up
    file.delete();
});
