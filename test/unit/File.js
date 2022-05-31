import test from 'ava';
import path from 'path';

import File from '../../src/File.js';
import { context } from '../helpers/test.js';

test.serial.beforeEach(t => {
    const { mix } = context(t);
    mix.setPublicPath('public');
});

test('it knows the file name', async t => {
    const file = new File('path/to/file.js');

    t.is('file.js', file.name());
});

test('it has a static constructor', async t => {
    const file = File.find('path/to/file.js');

    t.true(file instanceof File);
});

test('it knows the file name without the extension', async t => {
    const file = new File('path/to/file.js');

    t.is('file', file.nameWithoutExtension());
});

test('it knows the extension of the file', async t => {
    const file = new File('path/to/file.js');

    t.is('.js', file.extension());
});

test('it knows if a file exists', async t => {
    const { assert, disk } = context(t);

    const file = disk.join('filethatexists.js');

    assert().file(file).absent();

    new File(file).write('foobar');

    assert().file(file).exists();
});

test('it knows the size of a file', async t => {
    const { assert, disk } = context(t);

    const file = disk.join('filewithsize.js');

    new File(file).write('123456'); // plus newline equals size of 7.

    assert().file(file).exists();

    // Windows newline is a carriage return + linefeed
    const expected = process.platform === 'win32' ? 8 : 7;

    t.is(expected, new File(file).size());
});

test('it knows the path to the file', async t => {
    const { disk } = context(t);

    const file = disk.join('file.js');

    t.is(file, new File(file).path());
});

test.serial('it knows the relative path to the file', async t => {
    // TODO: Fix implicit reliance on cwd of the test
    // TODO: Fix implicit reliance global Mix from `File`
    const { disk } = context(t);

    const file = new File(disk.join('path/to/file.js'));
    const newFile = new File(disk.join('../path/to/file.js'));

    t.is(path.normalize('path/to/file.js'), file.relativePath());
    t.is(path.normalize('../path/to/file.js'), newFile.relativePath());
});

test.serial(
    'it can force the file to begin from the public path for the project.',
    async t => {
        // TODO: Fix implicit reliance on cwd of the test
        // TODO: Fix implicit reliance global Mix from `File`
        const file = new File('some/path/here.js');

        const newFile = file.forceFromPublic();

        t.true(newFile instanceof File);

        t.is(path.normalize('public/some/path/here.js'), newFile.relativePath());
    }
);

test.serial(
    'it knows the path to the file starting from the project public directory',
    async t => {
        // TODO: Fix implicit reliance on cwd of the test
        // TODO: Fix implicit reliance global Mix from `File`
        const { Mix } = context(t);

        let file = new File('public/js/file.js');

        t.is(path.normalize('/js/file.js'), file.pathFromPublic(Mix.config.publicPath));

        file = new File('js/file.js');

        t.is(path.normalize('/js/file.js'), file.pathFromPublic(Mix.config.publicPath));
    }
);

test('it knows the full path to the file without the extension', async t => {
    const file = new File('path/to/file.js');

    t.is(path.resolve('path/to/file'), file.pathWithoutExtension());
});

test('it knows the base directory path for the file', async t => {
    const file = new File('path/to/file.js');

    t.is(path.resolve('path/to'), file.base());
});

test('it knows if the current file path is a directory', async t => {
    t.true(new File('path/to').isDirectory());
    t.false(new File('path/to/file.js').isDirectory());
});

test('it knows if the current file path is a file', async t => {
    t.false(new File('path/to').isFile());
    t.true(new File('path/to/file.js').isFile());
});

test('it can read and write to a file', async t => {
    const { assert, disk } = context(t);

    const filePath = disk.join('file.js');
    const file = new File(filePath);

    file.write('foobar');
    assert().file(filePath).contains('foobar\n');

    file.write('changed');
    assert().file(filePath).contains('changed\n');
});

test('it can calculate a unique versioned hash for the file', async t => {
    const { disk } = context(t);

    const filePath = disk.join('file.js');

    const file = new File(filePath);

    file.write('foobar');

    t.true(!!file.version().length);
});

test('it can minify JS files.', async t => {
    const { assert, disk, fs } = context(t);

    const filePath = disk.join('file.js');

    await fs().stub({
        [filePath]: `
            var one = 'one';
            var two = 'two';
        `
    });

    await new File(filePath).minify();

    assert().file(filePath).contains('var one="one",two="two";\n');
});

test('it can minify CSS files.', async t => {
    const { assert, disk } = context(t);

    const filePath = disk.join('file.css');

    const file = new File(filePath);

    file.write(`
        body {
            color: red;
        }
    `);

    await file.minify();

    assert().file(filePath).contains('body{color:red}\n');
});

test('it can copy a file to a new location', async t => {
    const { assert, disk } = context(t);

    const filePath = disk.join('file.css');
    const file = new File(filePath).write('.foo {}');
    const copiedPath = disk.join('new.css');

    await file.copyTo(copiedPath);

    assert().file(copiedPath).exists();
    assert().file(filePath).contains('.foo {}\n');
});

test('it knows if its path contains a set of chars', async t => {
    const file = new File('some/path/**');

    t.true(file.contains('*'));
});

test('it can append to the current file path', async t => {
    const file = new File('some/path');

    t.true(file.append('**').contains('**'));
});

test('it knows the full path without query string', async t => {
    const { disk } = context(t);

    const filePath = disk.join('file.js');
    t.is(new File(filePath + '?query=string').pathWithoutQueryString(), filePath);
});
