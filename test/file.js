import test from 'ava';
import path from 'path';
import File from '../src/File';

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
