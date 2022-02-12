import test from 'ava';
import path from 'path';
import { fileURLToPath } from 'url';

import MixDefinitionsPlugin from '../../../src/webpackPlugins/MixDefinitionsPlugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('it fetches the MIX_ definitions properly', t => {
    let plugin = new MixDefinitionsPlugin(path.resolve(__dirname, 'testing.env'));

    let MIX_TESTING = '"123"';
    let NODE_ENV = '"production"';

    let definitions = plugin.getDefinitions({ NODE_ENV: 'production' });

    // Note that the definitions may contain more keys.
    // During a travis build with cached node modules, there's a MIX_ARCHIVES entry, for example.
    t.is(MIX_TESTING, definitions['process.env.MIX_TESTING']);
    t.is(NODE_ENV, definitions['process.env.NODE_ENV']);
});
