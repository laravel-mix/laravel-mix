import test from 'ava';
import mix from '../../src/index';
import MixDefinitionsPlugin from '../../src/webpackPlugins/MixDefinitionsPlugin';

test('it fetches the MIX_ definitions properly', t => {
    const plugin = new MixDefinitionsPlugin(
        path.resolve(__dirname, 'testing.env')
    );
    const MIX_TESTING = '"123"';
    const NODE_ENV = '"production"';
    const definitions = plugin.getDefinitions({ NODE_ENV: 'production' });
    // Note that the definitions may contain more keys.
    // During a travis build with cached node modules, there's a MIX_ARCHIVES entry, for example.
    t.is(MIX_TESTING, definitions['process.env'].MIX_TESTING);
    t.is(NODE_ENV, definitions['process.env'].NODE_ENV);
});
