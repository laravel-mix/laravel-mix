import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import eol from 'eol';
import '../src/index';

let stubsDir = path.resolve(__dirname, 'stubs');

test.before(t => fs.ensureDirSync(stubsDir));

test.afterEach(t => {
    fs.emptyDirSync(stubsDir);
});

test('it knows the file name', t => {
    let file = new File('path/to/file.js');

    t.is('file.js', file.name());
});

test('it has a static constructor', t => {
    let file = File.find('path/to/file.js');

    t.true(file instanceof File);
});

test('it knows the file name without the extension', t => {
    let file = new File('path/to/file.js');

    t.is('file', file.nameWithoutExtension());
});

test('it knows the extension of the file', t => {
    let file = new File('path/to/file.js');

    t.is('.js', file.extension());
});

test('it knows if a file exists', t => {
    let file = path.resolve(stubsDir, 'file.js');

    t.false(File.exists(file));

    new File(file).write('foobar');

    t.true(File.exists(file));
});

test('it knows the size of a file', t => {
    let file = path.resolve(stubsDir, 'file.js');

    new File(file).write('123456'); // plus newline equals size of 7.

    t.true(File.exists(file));

    let expected = 7;
    if (process.platform === 'win32') {
        expected = 8; // plus windows newline which is carriage return + linefeed
    }

    t.is(expected, new File(file).size());
});

test('it knows the path to the file', t => {
    let file = path.resolve(stubsDir, 'file.js');

    t.is(file, new File(file).path());
});

test('it knows the relative path to the file', t => {
    let file = new File('path/to/file.js');

    let newFile = new File('../path/to/file.js');

    t.is(path.normalize('path/to/file.js'), file.relativePath());
    t.is(path.normalize('../path/to/file.js'), newFile.relativePath());
});

test('it can force the file to begin from the public path for the project.', t => {
    Config.publicPath = 'public';

    let file = new File('some/path/here.js');

    let newFile = file.forceFromPublic();

    t.true(newFile instanceof File);

    t.is(path.normalize('public/some/path/here.js'), newFile.relativePath());
});

test('it knows the path to the file starting from the project public directory', t => {
    let file = new File('public/js/file.js');

    t.is(path.normalize('/js/file.js'), file.pathFromPublic(Config.publicPath));

    file = new File('js/file.js');

    t.is(path.normalize('/js/file.js'), file.pathFromPublic(Config.publicPath));
});

test('it knows the full path to the file without the extension', t => {
    let file = new File('path/to/file.js');

    t.is(path.resolve('path/to/file'), file.pathWithoutExtension());
});

test('it knows the base directory path for the file', t => {
    let file = new File('path/to/file.js');

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
    let filePath = path.resolve(stubsDir, 'file.js');

    let file = new File(filePath);

    file.write('foobar');

    t.is(eol.auto('foobar\n'), new File(filePath).read());

    file.write('changed');
});

test('it can calculate a unique versioned hash for the file', t => {
    let filePath = path.resolve(stubsDir, 'file.js');

    let file = new File(filePath);

    file.write('foobar');

    t.true(file.version().length === 20);
});

test('it can minify JS files.', t => {
    let filePath = path.resolve(stubsDir, 'file.js');

    let file = new File(filePath);

    file.write(`
            var one = 'one';
            var two = 'two';
    `);

    t.is(eol.auto('var one="one",two="two";\n'), file.minify().read());
});

test('it can minify CSS files.', t => {
    let filePath = path.resolve(stubsDir, 'file.css');

    let file = new File(filePath);

    file.write(`
            body {
                color: red;
            }
        `);

    file.minify();

    t.is(eol.auto('body{color:red}\n'), file.read());
});

test('it can copy a file to a new location', t => {
    let filePath = path.resolve(stubsDir, 'file.css');
    let file = new File(filePath);

    file.write('.foo {}');

    let copiedPath = path.resolve(stubsDir, 'new.css');

    file.copyTo(copiedPath);

    t.true(File.exists(copiedPath));
    t.is(eol.auto('.foo {}\n'), new File(copiedPath).read());
});

test('it knows if its path contains a set of chars', t => {
    let file = new File('some/path/**');

    t.true(file.contains('*'));
});

test('it can append to the current file path', t => {
    let file = new File('some/path');

    t.true(file.append('**').contains('**'));
});
