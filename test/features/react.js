import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import test from 'ava';
import path from 'path';
import sinon from 'sinon';

import File from '../../src/File.js';
import { assert, babel, mix, Mix, webpack } from '../helpers/test.js';
import ReactComponent from '../../src/components/React.js';

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

    assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
    assert(t).file(`test/fixtures/app/dist/css/app.css`).exists();
});

test('it sets the webpack entry correctly', async t => {
    mix.js('js/app.js', 'js').react();

    const config = await webpack.buildConfig();

    t.deepEqual(
        {
            '/js/app': [path.resolve('js/app.js')]
        },
        config.entry
    );
});

test('it sets the babel config correctly', async t => {
    const babelConfig = babel.recordConfigs();

    mix.react().js(`test/fixtures/app/src/js/app.js`, 'js');

    await webpack.compile();

    t.true(babelConfig.hasPreset('@babel/preset-react'));
});

test('non-feature-flag use of mix.react throws an error', t => {
    // @ts-expect-error
    t.throws(() => mix.react('js/app.js', 'js'), {
        message: /mix.react\(\) is now a feature flag/
    });
});

test('non-feature-flag use of mix.preact throws an error', t => {
    // @ts-expect-error
    t.throws(() => mix.react('js/app.js', 'js'), {
        message: /mix.react\(\) is now a feature flag/
    });
});

test('fast refreshing is disabled when not in hot mode', t => {
    t.false(new ReactComponent(Mix).supportsFastRefreshing());
});

test('it supports fast refreshing in hot mode if the React version is 16.9.0 or higher', t => {
    // Fake hot mode.
    Mix.isHot = () => true;

    let react = new ReactComponent(Mix);
    let library = sinon.stub(react, 'library');

    library.onFirstCall().returns({ version: '15.0.0' });
    t.false(react.supportsFastRefreshing());

    library.onSecondCall().returns({ version: '16.9.0' });
    t.true(react.supportsFastRefreshing());
});

test('it adds the necessary fast refreshing dependencies', t => {
    let react = new ReactComponent(Mix);

    sinon.stub(react, 'supportsFastRefreshing').returns(true);

    let dependencies = react.dependencies();

    t.truthy(
        dependencies.find(
            dependency =>
                dependency.package === '@pmmmwh/react-refresh-webpack-plugin@^0.5.0-rc.0'
        )
    );
    t.true(dependencies.includes('react-refresh'));
});

test('it adds the necessary fast refreshing webpack plugins', t => {
    let react = new ReactComponent(Mix);

    sinon.stub(react, 'supportsFastRefreshing').returns(true);

    t.true(react.webpackPlugins().length > 0);
    t.true(react.webpackPlugins()[0] instanceof ReactRefreshPlugin);
});

test('it adds the necessary babel config', t => {
    let react = new ReactComponent(Mix);

    sinon.stub(react, 'supportsFastRefreshing').returns(true);

    let babelConfig = react.babelConfig();

    t.true(babelConfig.presets[0].includes('@babel/preset-react'));
    t.true(babelConfig.plugins[0].includes(require.resolve('react-refresh/babel')));
});

test('it extracts css to a seperate file', async t => {
    mix.react({ extractStyles: true });
    mix.js(`test/fixtures/app/src/react/app-with-react-and-css`, 'js');

    await webpack.compile();

    let expected = `.component {
color: red;
}

`;

    assert(t).file(`test/fixtures/app/dist/css/react-styles.css`).exists();
    assert(t).file(`test/fixtures/app/dist/css/react-styles.css`).matchesCss(expected);
});

test('it extracts css to a named dedicated file', async t => {
    mix.react({ extractStyles: 'css/components.css' });
    mix.js(`test/fixtures/app/src/react/app-with-react-and-css`, 'js');

    await webpack.compile();

    let expected = `.component {
color: red;
}

`;

    assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();
    assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
});

test('it extracts css classes with a specified localIdentName', async t => {
    mix.react({ extractStyles: 'css/components.css' });
    mix.options({ cssModuleIdentifier: 'test' });
    mix.js(`test/fixtures/app/src/react/app-with-react-and-css-module`, 'js');

    await webpack.compile();

    let expected = `.test {
color: red;
}

`;

    assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();
    assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
});
