import test from 'ava';
import mix from '../../src/index';
import MixDefinitionsPlugin from '../../src/plugins/MixDefinitionsPlugin';

test('it fetches the MIX_ definitions properly', t => {
    let plugin = new MixDefinitionsPlugin(path.resolve(__dirname, 'testing.env'));

    t.deepEqual({
        'process.env': {
            MIX_TESTING: '"123"',
            NODE_ENV: '"production"'
        }
    }, plugin.getDefinitions({ NODE_ENV: 'production' }));
});
