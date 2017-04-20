import test from 'ava';
import '../src/index';
import FileCollection from '../src/FileCollection';

test('that it sets the output file if a src file and output directory are provided', t => {
    let src = new File('src/file.txt').parsePath();
    let files = new FileCollection(src.path);
    files.destination = 'output';

    t.is('output/file.txt', files.outputPath(src));
});


test('that it sets the output file if a src file and output directory are provided', t => {
    let src = new File('node_modules/path/to/it').parsePath();
    let files = new FileCollection(src.path);
    files.destination = 'public/output';

    t.is('public/output/nested/file.txt', files.outputPath(
        new File('node_modules/path/to/it/nested/file.txt').parsePath()
    ));
});
