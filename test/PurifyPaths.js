import test from 'ava';
import index from '../src/index';
import PurifyPaths from '../src/PurifyPaths';

test('that it builds the purify file paths properly', t => {
    let options = PurifyPaths.build({
        paths: ['foo.html']
    });

    t.deepEqual(options, { paths: ['foo.html'] });

    let stubs = [
        path.resolve(__dirname, 'stubs/one.html'),
        path.resolve(__dirname, 'stubs/two.html')
    ];

    new File(stubs[0]).write('foo');
    new File(stubs[1]).write('bar');

    // If the user gives a regular expressions, we need to glob it.
    options = PurifyPaths.build({
        paths: [__dirname + '/stubs/*.html']
    });

    // So let's make sure that updates the paths array properly...
    t.deepEqual(options, { paths: stubs });
});
