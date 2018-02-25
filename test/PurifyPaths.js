import test from 'ava';
import index from '../src/index';
import PurifyPaths from '../src/PurifyPaths';
import fs from 'fs-extra';

test.afterEach.always(t => {
    fs.removeSync('test/stubs');
});

test('that it builds the purify file paths properly', t => {
    let options = PurifyPaths.build({
        paths: ['foo.html']
    });

    t.deepEqual(options, { paths: ['foo.html'] });

    let stubs = [
        path.resolve(__dirname, 'stubs/one.html').replace(/\\/g, '/'),
        path.resolve(__dirname, 'stubs/two.html').replace(/\\/g, '/')
    ];

    new File(stubs[0]).makeDirectories().write('foo');
    new File(stubs[1]).makeDirectories().write('bar');

    // If the user gives a regular expressions, we need to glob it.
    options = PurifyPaths.build({
        paths: [__dirname + '/stubs/*.html']
    });

    // So let's make sure that updates the paths array properly...
    t.deepEqual(options, { paths: stubs });

    // Clean up.
    fs.remove(__dirname + '/stubs');
});
