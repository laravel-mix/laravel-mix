import test from 'ava';
import path from 'path';
let mix = require('../src/index').config;

test('that it calculates the project root', t => {
    // The project root should be three dirs up from where
    // laravel-mix is installed.
    let root = path.resolve(__dirname, '../../../');
    t.is(root, mix.Paths.root());

    // Test that setting a new root path works.
    root = path.resolve(__dirname);
    mix.Paths.setRootPath(root);
    t.is(root, mix.Paths.root());
});


test('that it calculates the webpack.mix path', t => {
    t.is(mix.Paths.root('webpack.mix'), mix.Paths.mix());
});
