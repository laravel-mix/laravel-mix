import test from 'ava';
import path from 'path';
import sinon from 'sinon';

import { assert, fs, mix, Mix, webpack } from '../helpers/test.js';

/**
 *
 * @param {string|number} version
 */
export function setupVueAliases(version) {
    const vueModule = version === 3 ? 'vue3' : 'vue2';
    const vueCompiler = version === 3 ? '@vue/compiler-dom' : 'vue-template-compiler';
    const vueLoaderModule = version === 3 ? 'vue-loader16' : 'vue-loader15';

    Mix.resolver.alias('vue', vueModule);
    Mix.resolver.alias('vue-loader', vueLoaderModule);
    Mix.resolver.alias('vue-compiler', vueCompiler);

    mix.alias({ vue: require.resolve(vueModule) });
}

/**
 * @param {object} opts
 * @param {number} opts.version
 * @param {string} opts.dir
 **/
export function setupVueTests({ version, dir }) {
    /** @type {any} */
    let compiler;

    let runtimeAliasPath =
        version === 2
            ? 'vue/dist/vue.runtime.esm.js'
            : 'vue/dist/vue.runtime.esm-bundler.js';
    let normalAliasPath =
        version === 2 ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.esm-bundler.js';
    let compilerName = version === 2 ? 'vue-template-compiler' : '@vue/compiler-sfc';

    test.beforeEach(() => {
        setupVueAliases(version);
        mix.options({ processCssUrls: false });

        compiler = compilerSpy();
    });

    test('it adds the Vue resolve alias', async t => {
        mix.vue({ extractStyles: true });

        const config = await webpack.buildConfig();

        t.is(normalAliasPath, config.resolve.alias.vue$);
    });

    test('non-feature-flag use of mix.vue throws an error', t => {
        // @ts-expect-error
        t.throws(() => mix.vue('js/app.js', 'js'), {
            message: /mix.vue\(\) is a feature flag/
        });
    });

    test('it adds the Vue runtime resolve alias', async t => {
        mix.vue({ runtimeOnly: true });

        const config = await webpack.buildConfig();

        t.is(runtimeAliasPath, config.resolve.alias.vue$);
    });

    test('it knows the Vue compiler name', t => {
        mix.vue();

        let dependencies = Mix.components.get('vue').dependencies();

        t.true(dependencies.includes(compilerName));
    });

    test('it switches to vue-style-loader when requested and not extracting styles', async t => {
        mix.vue({ extractStyles: false, useVueStyleLoader: true });

        const config = await webpack.buildConfig();

        assert(t).loader(config, 'vue-style-loader').exists();
        assert(t).loader(config, 'style-loader').absent();
        assert(t)
            .loader(config, /mini-css-extract-plugin/)
            .absent();
    });

    test('it does not switch to vue-style-loader when requested and extracting styles', async t => {
        mix.vue({ extractStyles: true, useVueStyleLoader: true });

        const config = await webpack.buildConfig();

        assert(t).loader(config, 'vue-style-loader').absent();
        assert(t)
            .loader(config, /mini-css-extract-plugin/)
            .exists();
    });

    test('it does not use vue-style-loader when not using .vue', async t => {
        const config = await webpack.buildConfig();

        assert(t).loader(config, 'vue-style-loader').absent();
        assert(t).loader(config, 'style-loader').exists();
    });

    test('it appends vue styles to your sass compiled file', async t => {
        mix.vue({ extractStyles: true });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js').sass(
            `test/fixtures/app/src/sass/app.scss`,
            'css/app.css'
        );

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
        assert(t).file(`test/fixtures/app/dist/css/app.css`).exists();

        let expected = `
            body { color: red; }
            .hello { color: blue; background: url(./does-not-exist.png); }
        `;
        assert(t).file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);
    });

    test('it appends vue styles to your less compiled file', async t => {
        mix.vue({ extractStyles: true });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js').less(
            `test/fixtures/app/src/less/main.less`,
            'css/app.css'
        );

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
        assert(t).file(`test/fixtures/app/dist/css/app.css`).exists();

        let expected = `
            body { color: pink; }
            .hello { color: blue; background: url(./does-not-exist.png); }
        `;
        assert(t).file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);
    });

    test('it appends vue styles to a vue-styles.css file, if no preprocessor is used', async t => {
        mix.vue({ extractStyles: true });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js');

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
        assert(t).file(`test/fixtures/app/dist/css/vue-styles.css`).exists();

        let expected = `.hello { color: blue; background: url(./does-not-exist.png); }`;
        assert(t).file(`test/fixtures/app/dist/css/vue-styles.css`).matchesCss(expected);
    });

    test('it extracts vue vanilla CSS styles to a dedicated file', async t => {
        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `.hello {color: green;}`;
        assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it extracts vue Stylus styles to a dedicated file', async t => {
        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-stylus.js`, 'js/app.js');

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `.hello { margin: 10px; }`;
        assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it does also add the vue webpack rules with typescript component', async t => {
        mix.vue();
        mix.ts('js/app.ts', 'public');

        const config = await webpack.buildConfig();

        assert(t)
            .rule(config, rule => String(rule.test) === '/\\.vue$/')
            .exists();
    });

    test('it extracts vue .scss styles to a dedicated file', async t => {
        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js').sass(
            `test/fixtures/app/src/sass/app.scss`,
            'css/app.css'
        );

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
        assert(t).file(`test/fixtures/app/dist/css/app.css`).exists();
        assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `body { color: red; }`;
        assert(t).file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);

        expected = `.hello { color: blue; background: url(./does-not-exist.png); }`;
        assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it extracts vue .sass styles to a dedicated file', async t => {
        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(
            `test/fixtures/app/src/${dir}/app-with-vue-and-indented-sass.js`,
            'js/app.js'
        ).sass(`test/fixtures/app/src/sass/app.scss`, 'css/app.css');

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
        assert(t).file(`test/fixtures/app/dist/css/app.css`).exists();
        assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `body {color: red;}`;
        assert(t).file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);

        expected = `.hello {color: black;}`;
        assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it extracts vue PostCSS styles to a dedicated file', async t => {
        // Given the user has a postcss.config.js file with the postcss-custom-properties plugin...
        await fs(t).stub({
            [path.resolve(
                'postcss.config.js'
            )]: `module.exports = { plugins: [require('postcss-custom-properties')] };`
        });

        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-postcss.js`, 'js/app.js');

        await webpack.compile();

        // In this example, postcss-loader is reading from postcss.config.js.
        let expected = `
            :root { --color: white; }
            .hello { color: white; color: var(--color); }
        `;
        assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it extracts vue Less styles to a dedicated file', async t => {
        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-less.js`, 'js/app.js');

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `.hello { color: blue; }`;
        assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it supports global Vue styles for sass', async t => {
        // Given the user has a postcss.config.js file with the postcss-custom-properties plugin...
        await fs(t).stub({
            [path.resolve(
                'postcss.config.js'
            )]: `module.exports = { plugins: [require('postcss-custom-properties')] };`
        });

        mix.vue({
            extractStyles: 'css/components.css',
            globalStyles: {
                css: [`test/fixtures/app/src/css/global.css`],
                sass: [`test/fixtures/app/src/sass/global.sass`],
                scss: [`test/fixtures/app/src/sass/global.scss`],
                less: [`test/fixtures/app/src/less/global.less`],
                stylus: [`test/fixtures/app/src/stylus/global.styl`]
            }
        });
        mix.js(
            `test/fixtures/app/src/${dir}/app-with-vue-and-global-styles.js`,
            'js/app.js'
        );
        mix.sass(`test/fixtures/app/src/sass/app.scss`, 'css/app.css');

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
        assert(t).file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `
            :root { --shared-color: rebeccapurple; }
            .shared-css { color: rebeccapurple; color: var(--shared-color); }
            .shared-scss { color: rebeccapurple; }
            .shared-sass { color: rebeccapurple; }
            .shared-less { color: rebeccapurple; }
            .shared-stylus { color: #639; }
        `;
        assert(t).file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it supports Vue SFCs with separate files', async t => {
        mix.vue();
        mix.js(
            `test/fixtures/app/src/${dir}/app-with-vue-separate-files.js`,
            'js/app.js'
        );

        await webpack.compile();

        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
    });

    test('Vue-loader options via mix.options.vue', async t => {
        mix.vue();
        mix.options({ vue: { compiler } });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        t.truthy(compiler.called);
        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
    });

    test('Vue-loader options via mix.vue', async t => {
        mix.vue({ options: { compiler } });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        t.true(compiler.called);
        assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();
    });

    test('References to feature flags are replaced', async t => {
        if (version !== 3) {
            t.pass.skip('Skipping for vue 2');
            return;
        }

        mix.vue();
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        assert(t)
            .file(`test/fixtures/app/dist/js/app.js`)
            .doesNotContain([
                'typeof __VUE_OPTIONS_API__',
                'typeof __VUE_PROD_DEVTOOLS__'
            ]);
    });

    test('The default Vue feature flags can be overridden', async t => {
        if (version !== 3) {
            t.pass.skip('Skipping for vue 2');
            return;
        }

        mix.vue();
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');
        mix.define({
            __VUE_OPTIONS_API__: false
        });

        await webpack.compile();

        // TODO: This relies on Vue internals — really this should be an integration test
        assert(t)
            .file(`test/fixtures/app/dist/js/app.js`)
            .contains(['false ? 0 : _vue_shared__']);
    });
}

function compilerSpy() {
    const compiler = require(Mix.resolve('vue-compiler'));
    const spy = sinon.spy();

    // We don't use sinon.spy directly because if you create a spy
    // of `require(compiler_package_name)` it will always be true
    // as that modifies the global object that's used by default.
    // Since we want to ensure that passing loader options works
    // we need to do that by ensuring our "custom" compiler is used
    return {
        ...compiler,

        /**
         * @param  {...any} args
         */
        compile(...args) {
            spy();

            return compiler.compile(...args);
        },

        get called() {
            return spy.called;
        }
    };
}
