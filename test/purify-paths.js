import test from 'ava';
import PurifyPaths from '../src/PurifyPaths';
import path from 'path';

test('that it builds the purify file paths properly', t => {
    let options = PurifyPaths.build({
        paths: ['foo.html']
    });

    t.deepEqual(options, { paths: ['foo.html'] });

    // If the user gives a regular expressions, we need to glob it.
    options = PurifyPaths.build({
        paths: [__dirname + '/fixtures/*.html']
    });

    // So let's make sure that updates the paths array properly...
    t.deepEqual(options, {
        paths: [
            path.resolve(__dirname, 'fixtures/stub.html')
        ]
    });
});
