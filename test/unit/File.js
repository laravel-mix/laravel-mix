import test from 'ava';
import fsx from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import File from '../../src/File.js';
import { assert, fs, mix, Mix } from '../helpers/test.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stubsDir = path.resolve(__dirname, 'stubs');

test.beforeEach(() => {
    mix.setPublicPath('public');

    fsx.ensureDirSync(stubsDir);
});

test.afterEach(() => {
    fsx.emptyDirSync(stubsDir);
});

test('it knows the file name', t => {
    const file = new File('path/to/file.js');

    t.is('file.js', file.name());
});

test('it has a static constructor', t => {
    const file = File.find('path/to/file.js');

    t.true(file instanceof File);
});

test('it knows the file name without the extension', t => {
    const file = new File('path/to/file.js');

    t.is('file', file.nameWithoutExtension());
});

test('it knows the extension of the file', t => {
    const file = new File('path/to/file.js');

    t.is('.js', file.extension());
});

test('it knows if a file exists', t => {
    const file = path.resolve(stubsDir, 'file.js');

    assert(t).file(file).absent();

    new File(file).write('foobar');

    assert(t).file(file).exists();
});

test('it knows the size of a file', t => {
    const file = path.resolve(stubsDir, 'file.js');

    new File(file).write('123456'); // plus newline equals size of 7.

    assert(t).file(file).exists();

    // Windows newline is a carriage return + linefeed
    const expected = process.platform === 'win32' ? 8 : 7;

    t.is(expected, new File(file).size());
});

test('it knows the path to the file', t => {
    const file = path.resolve(stubsDir, 'file.js');

    t.is(file, new File(file).path());
});

test('it knows the relative path to the file', t => {
    const file = new File('path/to/file.js');

    const newFile = new File('../path/to/file.js');

    t.is(path.normalize('path/to/file.js'), file.relativePath());
    t.is(path.normalize('../path/to/file.js'), newFile.relativePath());
});

test('it can force the file to begin from the public path for the project.', t => {
    const file = new File('some/path/here.js');

    const newFile = file.forceFromPublic();

    t.true(newFile instanceof File);

    t.is(path.normalize('public/some/path/here.js'), newFile.relativePath());
});

test('it knows the path to the file starting from the project public directory', t => {
    let file = new File('public/js/file.js');

    t.is(path.normalize('/js/file.js'), file.pathFromPublic(Mix.config.publicPath));

    file = new File('js/file.js');

    t.is(path.normalize('/js/file.js'), file.pathFromPublic(Mix.config.publicPath));
});

test('it knows the full path to the file without the extension', t => {
    const file = new File('path/to/file.js');

    t.is(path.resolve('path/to/file'), file.pathWithoutExtension());
});

test('it knows the base directory path for the file', t => {
    const file = new File('path/to/file.js');

    t.is(path.resolve('path/to'), file.base());
});

test('it knows if the current file path is a directory', t => {
    t.true(new File('path/to').isDirectory());
    t.false(new File('path/to/file.js').isDirectory());
});

test('it knows if the current file path is a file', t => {
    t.false(new File('path/to').isFile());
    t.true(new File('path/to/file.js').isFile());
});

test('it can read and write to a file', t => {
    const filePath = path.resolve(stubsDir, 'file.js');
    const file = new File(filePath);

    file.write('foobar');
    assert(t).file(filePath).contains('foobar\n');

    file.write('changed');
    assert(t).file(filePath).contains('changed\n');
});

test('it can calculate a unique versioned hash for the file', t => {
    const filePath = path.resolve(stubsDir, 'file.js');

    const file = new File(filePath);

    file.write('foobar');

    t.true(!!file.version().length);
});

test('it can minify JS files.', async t => {
    const filePath = path.resolve(stubsDir, 'file.js');

    await fs(t).stub({
        [filePath]: `
            var one = 'one';
            var two = 'two';
        `
    });

    await new File(filePath).minify();

    assert(t).file(filePath).contains('var one="one",two="two";\n');
});

test('it can minify CSS files.', async t => {
    const filePath = path.resolve(stubsDir, 'file.css');

    const file = new File(filePath);

    file.write(`
            body {
                color: red;
            }
        `);

    await file.minify();

    assert(t).file(filePath).contains('body{color:red}\n');
});

test('it can copy a file to a new location', t => {
    const filePath = path.resolve(stubsDir, 'file.css');
    const file = new File(filePath).write('.foo {}');
    const copiedPath = path.resolve(stubsDir, 'new.css');

    file.copyTo(copiedPath);

    assert(t).file(copiedPath).exists();
    assert(t).file(filePath).contains('.foo {}\n');
});

test('it knows if its path contains a set of chars', t => {
    const file = new File('some/path/**');

    t.true(file.contains('*'));
});

test('it can append to the current file path', t => {
    const file = new File('some/path');

    t.true(file.append('**').contains('**'));
});

test('it knows the full path without query string', t => {
    const filePath = path.resolve(stubsDir, 'file.js');
    t.is(new File(filePath + '?query=string').pathWithoutQueryString(), filePath);
});
