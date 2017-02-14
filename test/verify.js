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
