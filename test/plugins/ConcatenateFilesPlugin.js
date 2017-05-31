import test from 'ava';
import index from '../../src/index';
import ConcatenateFilesPlugin from '../../src/plugins/ConcatenateFilesPlugin';

let stub1 = new File(path.join(__dirname, 'stubs/one.js'));
let stub2 = new File(path.join(__dirname, 'stubs/two.js'));
let output = new File(path.join(__dirname, 'stubs/combined.js'));

test.afterEach(t => {
    stub1.delete();
    stub2.delete();
    output.delete();
});


test('that it merges files', t => {
    stub1.write('var foo;');
    stub2.write('var bar;');

    let plugin = new ConcatenateFilesPlugin([
        {
            src: [stub1.path(), stub2.path()],
            output,
            babel: false
        }
    ]);

    plugin.apply();

    t.is("var foo;\nvar bar;", output.read());
});
