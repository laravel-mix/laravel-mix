import test from 'ava';
import path from 'path';
import File from '../../src/File';

import webpack from '../helpers/webpack';
import assert from '../helpers/assertions';

import { mix, Mix } from '../helpers/mix';

test.beforeEach(() => {
    webpack.setupVueAliases(2);
    mix.options({ processCssUrls: false });
});

test('it adds the Vue 2 resolve alias', async t => {
    mix.vue({ version: 2, extractStyles: true });

    t.is('vue/dist/vue.esm.js', (await webpack.buildConfig()).resolve.alias.vue$);
});

test('non-feature-flag use of mix.vue throws an error', t => {
    t.throws(() => mix.vue('js/app.js', 'js'), {
        message: /mix.vue\(\) is a feature flag/
    });
});

test('it adds the Vue 2 runtime resolve alias', async t => {
    mix.vue({ version: 2, runtimeOnly: true });

    t.is('vue/dist/vue.runtime.esm.js', (await webpack.buildConfig()).resolve.alias.vue$);
});

test('it knows the Vue 2 compiler name', t => {
    mix.vue({ version: 2 });

    let dependencies = Mix.components.get('vue').dependencies();

    t.true(dependencies.includes('vue-template-compiler'));
});

test('it switches to vue-style-loader when not extracting styles', async t => {
    mix.vue({ version: 2, extractStyles: false });

    const config = await webpack.buildConfig();

    assert.hasWebpackLoader(t, config, 'vue-style-loader');
    assert.doesNotHaveWebpackLoader(t, config, 'style-loader');
    assert.doesNotHaveWebpackLoader(t, config, /mini-css-extract-plugin/);
});

test('it does not switch to vue-style-loader when extracting styles', async t => {
    mix.vue({ version: 2, extractStyles: true });

    const config = await webpack.buildConfig();

    assert.doesNotHaveWebpackLoader(t, config, 'vue-style-loader');
    assert.hasWebpackLoader(t, config, /mini-css-extract-plugin/);
});

test('it does not use vue-style-loader when not using .vue', async t => {
    const config = await webpack.buildConfig();

    assert.doesNotHaveWebpackLoader(t, config, 'vue-style-loader');
    assert.hasWebpackLoader(t, config, 'style-loader');
});

test('it appends vue styles to your sass compiled file', async t => {
    mix.vue({ version: 2, extractStyles: true });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-scss.js`, 'js/app.js').sass(
        `test/fixtures/app/src/sass/app.scss`,
        'css/app.css'
    );

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));

    let expected = `body {
  color: red;
}


.hello {
  color: blue;
  background: url(./does-not-exist.png);
}
`;

    assert.fileMatchesCss(`test/fixtures/app/dist/css/app.css`, expected, t);
});

test('it appends vue styles to your less compiled file', async t => {
    mix.vue({ version: 2, extractStyles: true });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-scss.js`, 'js/app.js').less(
        `test/fixtures/app/src/less/main.less`,
        'css/app.css'
    );

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));

    let expected = `body {
  color: pink;
}

.hello {
  color: blue;
  background: url(./does-not-exist.png);
}
`;

    t.is(expected, File.find(`test/fixtures/app/dist/css/app.css`).read());
});

test('it appends vue styles to a vue-styles.css file, if no preprocessor is used', async t => {
    mix.vue({ version: 2, extractStyles: true });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-scss.js`, 'js/app.js');

    await webpack.compile();
    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/vue-styles.css`));

    let expected = `.hello {
  color: blue;
  background: url(./does-not-exist.png);
}
`;

    t.is(expected, File.find(`test/fixtures/app/dist/css/vue-styles.css`).read());
});

test('it extracts vue vanilla CSS styles to a dedicated file', async t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-css.js`, 'js/app.js');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/components.css`));

    let expected = `
.hello {
    color: green;
}

`;

    t.is(expected, File.find(`test/fixtures/app/dist/css/components.css`).read());
});

test('it extracts vue Stylus styles to a dedicated file', async t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-stylus.js`, 'js/app.js');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/components.css`));

    let expected = `.hello {
  margin: 10px;
}

`;

    t.is(expected, File.find(`test/fixtures/app/dist/css/components.css`).read());
});

test('it does also add the vue webpack rules with typescript component', async t => {
    mix.vue({ version: 2 });
    mix.ts('js/app.js', 'dist/js');

    t.truthy(
        (await webpack.buildConfig()).module.rules.find(
            rule => rule.test.toString() === '/\\.vue$/'
        )
    );
});

test('it extracts vue .scss styles to a dedicated file', async t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-scss.js`, 'js/app.js').sass(
        `test/fixtures/app/src/sass/app.scss`,
        'css/app.css'
    );

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));
    t.true(File.exists(`test/fixtures/app/dist/css/components.css`));

    let expected = `body {
  color: red;
}


`;

    assert.fileMatchesCss(`test/fixtures/app/dist/css/app.css`, expected, t);

    expected = `.hello {
  color: blue;
  background: url(./does-not-exist.png);
}
`;

    assert.fileMatchesCss(`test/fixtures/app/dist/css/components.css`, expected, t);
});

test('it extracts vue .sass styles to a dedicated file', async t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(
        `test/fixtures/app/src/vue/app-with-vue-and-indented-sass.js`,
        'js/app.js'
    ).sass(`test/fixtures/app/src/sass/app.scss`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));
    t.true(File.exists(`test/fixtures/app/dist/css/components.css`));

    let expected = `body {
  color: red;
}


`;

    assert.fileMatchesCss(`test/fixtures/app/dist/css/app.css`, expected, t);

    expected = `.hello {
  color: black;
}
`;

    assert.fileMatchesCss(`test/fixtures/app/dist/css/components.css`, expected, t);
});

test('it extracts vue PostCSS styles to a dedicated file', async t => {
    // Given the user has a postcss.config.js file with the postcss-custom-properties plugin...
    let postCssConfigFile = new File(path.resolve('postcss.config.js')).write(
        `module.exports = { plugins: [require('postcss-custom-properties')] };`
    );

    // When we compile Vue...
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-postcss.js`, 'js/app.js');

    await webpack.compile();

    // The generated output should be...
    let expected = `
:root {
    --color: white;
}
.hello {
    color: white;
    color: var(--color);
}

`;

    t.is(expected, File.find(`test/fixtures/app/dist/css/components.css`).read());

    // Clean up.
    postCssConfigFile.delete();
});

test('it extracts vue Less styles to a dedicated file', async t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-less.js`, 'js/app.js');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/components.css`));

    let expected = `.hello {
  color: blue;
}

`;

    t.is(expected, File.find(`test/fixtures/app/dist/css/components.css`).read());
});

test('it supports global Vue styles for sass', async t => {
    // Given the user has a postcss.config.js file with the postcss-custom-properties plugin...
    let postCssConfigFile = new File(path.resolve('postcss.config.js')).write(
        `module.exports = { plugins: [require('postcss-custom-properties')] };`
    );

    mix.vue({
        version: 2,
        extractStyles: 'css/components.css',
        globalStyles: {
            css: [`test/fixtures/app/src/css/global.css`],
            sass: [`test/fixtures/app/src/sass/global.sass`],
            scss: [`test/fixtures/app/src/sass/global.scss`],
            less: [`test/fixtures/app/src/less/global.less`],
            stylus: [`test/fixtures/app/src/stylus/global.styl`]
        }
    });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-global-styles.js`, 'js/app.js');
    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.true(File.exists(`test/fixtures/app/dist/css/components.css`));

    let expected = `
:root {
    --shared-color: rebeccapurple;
}
.shared-css {
    color: rebeccapurple;
    color: var(--shared-color);
}

.shared-scss {
  color: rebeccapurple;
}
.shared-sass {
  color: rebeccapurple;
}
.shared-less {
  color: rebeccapurple;
}

.shared-stylus {
  color: #639;
}
`;

    t.is(
        expected.trim(),
        File.find(`test/fixtures/app/dist/css/components.css`).read().trim()
    );

    postCssConfigFile.delete();
});

test('it supports Vue SFCs with separate files', async t => {
    mix.vue({ version: 2 });
    mix.js(`test/fixtures/app/src/vue/app-with-vue-separate-files.js`, 'js/app.js');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
});

test('Vue-loader options via mix.options.vue', async t => {
    const compiler = compilerSpy();

    mix.vue({ version: 2 });
    mix.options({ vue: { compiler } });

    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-css.js`, 'js/app.js');

    await webpack.compile();

    t.truthy(compiler.called);

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
});

test('Vue-loader options via mix.vue', async t => {
    const compiler = compilerSpy();

    mix.vue({
        version: 2,
        options: { compiler }
    });

    mix.js(`test/fixtures/app/src/vue/app-with-vue-and-css.js`, 'js/app.js');

    await webpack.compile();

    t.true(compiler.called);

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
});

function compilerSpy() {
    const compiler = require('vue-template-compiler');
    let called = false;

    // We don't use sinon.spy here because if you create a spy of
    // `require("vue-template-compiler")` it will always be true
    // as that modifies the global object that's used by default.
    // Since we want to ensure that passing loader options works
    // we need to do that by ensuring our "custom" compiler is used
    return {
        ...compiler,

        compile(...args) {
            called = true;

            return compiler.compile(...args);
        },

        get called() {
            return called;
        }
    };
}
