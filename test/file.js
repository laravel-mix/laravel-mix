import test from 'ava';
import mockFs from 'mock-fs';
import '../src/index';


test.afterEach(t => mockFs.restore());


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
    t.false(File.exists('path/to/some/file.js'));

    mockFs({
        'path/to/some/file.js': 'foobar'
    });

    t.true(File.exists('path/to/some/file.js'));
});


test('it knows the size of a file', t => {
    let file = 'path/to/some/file.js';

    // Assume this file exists...
    mockFs({ [file]: '123456' });

    t.true(File.exists(file));

    t.is(6, new File(file).size());
});


test('it knows the path to the file', t => {
    let file = new File('path/to/file.js');

    t.is(path.resolve('path/to/file.js'), file.path());
});


test('it knows the relative to the file', t => {
    let file = new File('path/to/file.js');

    t.is('path/to/file.js', file.relativePath());
});


test('it can force the file to begin from the public path for the project.', t => {
    Config.publicPath = 'public';

    let file = new File('some/path/here.js');

    let newFile = file.forceFromPublic();

    t.true(newFile instanceof File);

    t.is('public/some/path/here.js', newFile.relativePath());
});


test('it knows the path to the file starting from the project public directory', t => {
    let file = new File('public/js/file.js');

    t.is('/js/file.js', file.pathFromPublic(Config.publicPath));

    file = new File('js/file.js');

    t.is('/js/file.js', file.pathFromPublic(Config.publicPath));
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
    mockFs({
        'path/to/some/file.js': 'foobar'
    });

    let file = new File('path/to/some/file.js');

    t.is('foobar', file.read());

    file.write('changed');
});


test('it can version a file', t => {
    mockFs({
        'path/to/some/file.js': 'foobar'
    });

    let file = new File('path/to/some/file.js');

    // If we version the file, then it should be
    // renamed behind the scenes.
    file = file.version();

    // So let's make sure the original file doesn't exist.
    t.false(File.exists('path/to/some/file.js'));

    // And the new path does.
    t.true(File.exists(file.path()));
});


test('it can version a file without deleting the unversioned counterpart', t => {
    mockFs({
        'path/to/some/file.js': 'foobar'
    });

    let file = new File('path/to/some/file.js');

    // If we version the file, then it should be
    // renamed behind the scenes.
    let deleteUnversionedFile = false;
    file = file.version(deleteUnversionedFile);

    // Because we specified tha the unversioned counterpart
    // shouldn't be deleted, it should still exist.
    t.true(File.exists('path/to/some/file.js'));

    // // And the new path does.
    t.true(File.exists(file.path()));
});


test('it can minify JS files.', t => {
    mockFs({
        'path/to/some/file.js': `
            var one = 'one';
            var two = 'two';
        `
    });

    let file = new File('path/to/some/file.js');

    t.is('var one="one",two="two";', file.minify().read());
});


test('it can minify CSS files.', t => {
    mockFs({
        'path/to/file.css': `
            body {
                color: red;
            }
        `
    });

    let file = new File('path/to/file.css').minify();

    t.is('body{color:red}', file.read());
});


test('it can copy a file to a new location', t => {
    mockFs({
        'path/to/file.css': '.foo {}'
    });

    let file = new File('path/to/file.css').copyTo('path/to/new.css');

    t.true(File.exists('path/to/new.css'));
    t.is('.foo {}', new File('path/to/new.css').read());
});


test('it knows if its path contains a set of chars', t => {
    let file = new File('some/path/**');

    t.true(file.contains('*'));
});


test('it can append to the current file path', t => {
    let file = new File('some/path');

    t.true(file.append('**').contains('**'));
});
