import test from 'ava';
import path from 'path';
import File from '../src/File';

test('that it parses path segments', t => {
    const dummyFile = new File(path.resolve(__dirname, 'dummy.txt'));
    const segments = dummyFile.parsePath();
    t.deepEqual(segments, {
        path: dummyFile.file,
        hashedPath: dummyFile.file.replace('dummy.txt', 'dummy.[hash].txt'),
        base: path.resolve(__dirname),
        file: "dummy.txt",
        hashedFile: "dummy.[hash].txt",
        name: "dummy",
        isDir: false,
        ext: ".txt"
    });
});
test('that it minifies js/css files correctly.', t => {
    // create dummy files
    const dummyJsFilePath = path.resolve(__dirname, 'dummy.js');
    const dummyCssFilePath = path.resolve(__dirname, 'dummy.css');
    const jsCodeToMinify = new File(path.resolve(__dirname,
        'fixtures/minifyme.js')).read();
    const cssCodeToMinify = new File(path.resolve(__dirname,
        'fixtures/minifyme.css')).read();
    const jsCodeMinified = new File(path.resolve(__dirname,
        'fixtures/minifyme.min.js')).read();
    const cssCodeMinified = new File(path.resolve(__dirname,
        'fixtures/minifyme.min.css')).read();

    const dummyJsFile = new File(dummyJsFilePath).write(jsCodeToMinify);
    const dummyCssFile = new File(dummyCssFilePath).write(cssCodeToMinify);

    dummyJsFile.minify();
    t.is(dummyJsFile.read(), jsCodeMinified);
    dummyJsFile.delete();

    dummyCssFile.minify();
    t.is(dummyCssFile.read(), cssCodeMinified);
    dummyCssFile.delete();

    dummyJsFile.delete();
    dummyCssFile.delete();
});