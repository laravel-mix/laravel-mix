import test from 'ava';
import mix from '../src/Mix';

test('that it calculates the project root', t => {

    // The project root should be three dirs up from where
    // laravel-mix is installed.
    let root = require('path').resolve(__dirname, '../../../');

    t.is(root, mix.paths.root());
});


test('that it calculates the webpack.mix path', t => {
    t.is(mix.paths.root('webpack.mix'), mix.paths.mix());
});
