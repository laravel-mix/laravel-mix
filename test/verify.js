import test from 'ava';
import Verify from '../src/Verify';
import File from '../src/File';

test('that it verifies mix.js() params', t => {
    t.throws(() => Verify.js());
    t.throws(() => Verify.js('src'));
    t.notThrows(() => Verify.js('src', 'dest'));
});


test('that it verifies mix.sass() and mix.less() params', t => {
    t.throws(() => Verify.preprocessor('sass'));
    t.throws(() => Verify.preprocessor('sass', 'src'));
    t.notThrows(() => Verify.preprocessor('sass', 'src', 'dest'));
});


test('that it verifies mix.extract() params', t => {
    t.throws(() => Verify.extract());
    t.throws(() => Verify.extract('without-array'));
    t.notThrows(() => Verify.extract(['lib']));
});


test('that it verifies mix.combine() params', t => {
    t.throws(() => Verify.combine());

    // If a file passed to mix.combine() doesn't exist,
    // Mix will throw an assertion error.
    let stub = new File(__dirname + '/stub.js');
    t.throws(() => Verify.combine([stub.path()]));

    // But of course it won't fail, if the file
    // does exist.
    stub.write('');
    t.notThrows(() => Verify.combine([stub.path()]));
    stub.delete();
});
