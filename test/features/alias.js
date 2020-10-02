import mix from './helpers/setup';
import path from 'path';
import webpack from '../helpers/webpack';

test('it handles resolution aliases', async t => {
    mix.alias({
        '@': './foobar'
    });

    let { config } = await webpack.compile();

    t.deepEqual(
        {
            '@': path.resolve(__dirname, '../../foobar')
        },
        config.resolve.alias
    );
});
