import test from 'ava';
import index from '../../src/index';
import CopyWebpackPlugin from '../../src/plugins/CopyWebpackPlugin';

let stub1 = new File(path.join(__dirname, 'stubs/one.js'));
let output = new File(path.join(__dirname, 'stubs/destination.js'));

test.afterEach(t => {
    stub1.delete();
    output.delete();
});


test('that it copies a file to a new location', t => {
    stub1.write('var foo;');

    let plugin = new CopyWebpackPlugin([
        {
            from: stub1.path(),
            to: output
        }
    ]);

    t.is("var foo;", output.read());
});
