import test from 'ava';
import mix from '../src/Mix';
import path from 'path';

test('that it calculates the project root', t => {

    // The project root should be three dirs up from where
    // laravel-mix is installed.
    let root = path.resolve(__dirname, '../../../');
    t.is(root, mix.Paths.root());

    // Test setting a new root path works
    root = path.resolve(__dirname);
    mix.Paths.setRootPath(root);
    t.is(root, mix.Paths.root());
});


test('that it calculates the webpack.mix path', t => {
    t.is(mix.Paths.root('webpack.mix'), mix.Paths.mix());
});
