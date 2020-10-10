import test from 'ava';
import path from 'path';
import File from '../../src/File';

import webpack from '../helpers/webpack';

import '../helpers/mix';

test('mix.react()', t => {
    mix.react().js('src/app.js', 'dist');

    t.deepEqual(
        [
            {
                entry: [new File('src/app.js')],
                output: new File('dist')
            }
        ],
        Mix.components.get('js').toCompile
    );
});

test('it compiles React and a preprocessor properly', async t => {
    mix.react()
        .js(`test/fixtures/app/src/js/app.js`, 'js')
        .sass(`test/fixtures/app/src/sass/app.scss`, 'css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));
});

test('it sets the webpack entry correctly', t => {
    mix.js('js/app.js', 'js').react();

    t.deepEqual(
        {
            '/js/app': [path.resolve('js/app.js')]
        },
        webpack.buildConfig().entry
    );
});

test('it sets the babel config correctly', t => {
    mix.react().js('js/app.js', 'js');

    webpack.buildConfig();

    t.true(
        Config.babel().presets.find(p =>
            p.includes(path.normalize('@babel/preset-react'))
        ) !== undefined
    );
});

test('non-feature-flag use of mix.react throws an error', t => {
    t.throws(() => mix.react('js/app.js', 'js'), {
        message: /mix.react\(\) is now a feature flag/
    });
});

test('non-feature-flag use of mix.preact throws an error', t => {
    t.throws(() => mix.react('js/app.js', 'js'), {
        message: /mix.react\(\) is now a feature flag/
    });
});
