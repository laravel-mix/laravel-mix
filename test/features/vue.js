import test from 'ava';
import path from 'path';
import sinon from 'sinon';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

import { context } from '../helpers/test.js';

/**
 * @param {string|number} version
 * @param {import('../../src/Mix.js')} Mix
 */
export function setupVueAliases(version, Mix) {
    const vueModule = version === 3 ? 'vue3/dist/vue.cjs.js' : 'vue2/dist/vue.common.js';
    const vueCompiler = version === 3 ? '@vue/compiler-dom' : 'vue-template-compiler';
    const vueLoaderModule = version === 3 ? 'vue-loader16' : 'vue-loader15';

    Mix.resolver.alias('vue', vueModule);
    Mix.resolver.alias('vue-loader', vueLoaderModule);
    Mix.resolver.alias('vue-compiler', vueCompiler);

    const require = createRequire(import.meta.url);
    Mix.api.alias({
        vue: require.resolve(vueModule),
        vue$: require.resolve(vueModule)
    });
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

    test.beforeEach(async t => {
        const { mix, Mix } = context(t);

        await setupVueAliases(version, Mix);
        mix.options({ processCssUrls: false });

        compiler = await compilerSpy(Mix);
    });

    test('it adds the Vue resolve alias', async t => {
        const { mix, webpack } = context(t);

        mix.vue({ extractStyles: true });

        const config = await webpack.buildConfig();

        t.is(normalAliasPath, config.resolve.alias.vue$);
    });

    test.serial('non-feature-flag use of mix.vue throws an error', async t => {
        const { mix } = context(t);

        // @ts-expect-error
        t.throws(() => mix.vue('js/app.js', 'js'), {
            message: /mix.vue\(\) is a feature flag/
        });
    });

    test('it adds the Vue runtime resolve alias', async t => {
        const { mix, webpack } = context(t);

        mix.vue({ runtimeOnly: true });

        const config = await webpack.buildConfig();

        t.is(runtimeAliasPath, config.resolve.alias.vue$);
    });

    test.serial('it knows the Vue compiler name', async t => {
        const { mix, Mix } = context(t);

        mix.vue();

        let dependencies = Mix.components.get('vue').dependencies();

        t.true(dependencies.includes(compilerName));
    });

    test('it switches to vue-style-loader when requested and not extracting styles', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: false, useVueStyleLoader: true });

        const config = await webpack.buildConfig();

        assert().loader(config, 'vue-style-loader').exists();
        assert().loader(config, 'style-loader').absent();
        assert()
            .loader(config, /mini-css-extract-plugin/)
            .absent();
    });

    test('it does not switch to vue-style-loader when requested and extracting styles', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: true, useVueStyleLoader: true });

        const config = await webpack.buildConfig();

        assert().loader(config, 'vue-style-loader').absent();
        assert()
            .loader(config, /mini-css-extract-plugin/)
            .exists();
    });

    test('it does not use vue-style-loader when not using .vue', async t => {
        const { assert, webpack } = context(t);

        const config = await webpack.buildConfig();

        assert().loader(config, 'vue-style-loader').absent();
        assert().loader(config, 'style-loader').exists();
    });

    test.serial('it appends vue styles to your sass compiled file', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: true });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js').sass(
            `test/fixtures/app/src/sass/app.scss`,
            'css/app.css'
        );

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/css/app.css`).exists();

        let expected = `
            body { color: red; }
            .hello { color: blue; background: url(./does-not-exist.png); }
        `;
        assert().file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);
    });

    test.serial('it appends vue styles to your less compiled file', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: true });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js').less(
            `test/fixtures/app/src/less/main.less`,
            'css/app.css'
        );

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/css/app.css`).exists();

        let expected = `
            body { color: pink; }
            .hello { color: blue; background: url(./does-not-exist.png); }
        `;
        assert().file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);
    });

    test.serial(
        'it appends vue styles to a vue-styles.css file, if no preprocessor is used',
        async t => {
            const { assert, mix, webpack } = context(t);

            mix.vue({ extractStyles: true });
            mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js');

            await webpack.compile();

            assert().file(`test/fixtures/app/dist/js/app.js`).exists();
            assert().file(`test/fixtures/app/dist/css/vue-styles.css`).exists();

            let expected = `.hello { color: blue; background: url(./does-not-exist.png); }`;
            assert()
                .file(`test/fixtures/app/dist/css/vue-styles.css`)
                .matchesCss(expected);
        }
    );

    test.serial('it extracts vue vanilla CSS styles to a dedicated file', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `.hello {color: green;}`;
        assert().file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test.serial('it extracts vue Stylus styles to a dedicated file', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-stylus.js`, 'js/app.js');

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `.hello { margin: 10px; }`;
        assert().file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test('it does also add the vue webpack rules with typescript component', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue();
        mix.ts('js/app.ts', 'public');

        const config = await webpack.buildConfig();

        assert()
            .rule(config, rule => String(rule.test) === '/\\.vue$/')
            .exists();
    });

    test.serial('it extracts vue .scss styles to a dedicated file', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-scss.js`, 'js/app.js').sass(
            `test/fixtures/app/src/sass/app.scss`,
            'css/app.css'
        );

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/css/app.css`).exists();
        assert().file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `body { color: red; }`;
        assert().file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);

        expected = `.hello { color: blue; background: url(./does-not-exist.png); }`;
        assert().file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test.serial('it extracts vue .sass styles to a dedicated file', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(
            `test/fixtures/app/src/${dir}/app-with-vue-and-indented-sass.js`,
            'js/app.js'
        ).sass(`test/fixtures/app/src/sass/app.scss`, 'css/app.css');

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/css/app.css`).exists();
        assert().file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `body {color: red;}`;
        assert().file(`test/fixtures/app/dist/css/app.css`).matchesCss(expected);

        expected = `.hello {color: black;}`;
        assert().file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test.serial('it extracts vue PostCSS styles to a dedicated file', async t => {
        const { assert, fs, mix, webpack } = context(t);

        // Given the user has a postcss.config.js file with the postcss-custom-properties plugin...
        await fs().stub({
            [path.resolve(
                'postcss.config.cjs'
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
        assert().file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test.serial('it extracts vue Less styles to a dedicated file', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ extractStyles: 'css/components.css' });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-less.js`, 'js/app.js');

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `.hello { color: blue; }`;
        assert().file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test.serial('it supports global Vue styles for sass', async t => {
        const { assert, fs, mix, webpack } = context(t);

        // Given the user has a postcss.config.js file with the postcss-custom-properties plugin...
        await fs().stub({
            [path.resolve(
                'postcss.config.cjs'
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

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/css/components.css`).exists();

        let expected = `
            :root { --shared-color: rebeccapurple; }
            .shared-css { color: rebeccapurple; color: var(--shared-color); }
            .shared-scss { color: rebeccapurple; }
            .shared-sass { color: rebeccapurple; }
            .shared-less { color: rebeccapurple; }
            .shared-stylus { color: #639; }
        `;
        assert().file(`test/fixtures/app/dist/css/components.css`).matchesCss(expected);
    });

    test.serial('it supports Vue SFCs with separate files', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue();
        mix.js(
            `test/fixtures/app/src/${dir}/app-with-vue-separate-files.js`,
            'js/app.js'
        );

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    });

    test.serial('Vue-loader options via mix.options.vue', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue();
        mix.options({ vue: { compiler } });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        t.truthy(compiler.called);
        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    });

    test.serial('Vue-loader options via mix.vue', async t => {
        const { assert, mix, webpack } = context(t);

        mix.vue({ options: { compiler } });
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        t.true(compiler.called);
        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    });

    test.serial('References to feature flags are replaced', async t => {
        const { assert, mix, webpack } = context(t);

        if (version !== 3) {
            t.pass.skip('Skipping for vue 2');

            return;
        }

        mix.vue();
        mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

        await webpack.compile();

        assert()
            .file(`test/fixtures/app/dist/js/app.js`)
            .doesNotContain([
                'typeof __VUE_OPTIONS_API__',
                'typeof __VUE_PROD_DEVTOOLS__',
                'typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__'
            ]);
    });

    test.serial('The default Vue feature flags can be overridden', async t => {
        const { assert, mix, webpack } = context(t);

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
        assert()
            .file(`test/fixtures/app/dist/js/app.js`)
            .contains(['false ? 0 : _vue_shared__']);
    });

    test.serial(
        'File loader has esModule disabled for Vue 2 and is not broken by custom loader rules',
        async t => {
            const { assert, mix, webpack } = context(t);

            if (version === 3) {
                t.pass.skip('Skipping for vue 3');

                return;
            }

            // Using an extension so it modifies the rules before Vue processes them
            mix.extend('foo', {
                webpackRules() {
                    return [
                        {
                            test: /\.something1$/,
                            loader: 'css-loader'
                        },
                        {
                            test: /\.something2$/,
                            use: 'css-loader'
                        },
                        {
                            test: /\.something3$/,
                            use: ['css-loader']
                        },
                        {
                            test: /\.something3$/,
                            use: [{ ident: 'foobar' }]
                        }
                    ];
                }
            });

            // @ts-ignore
            mix.foo();

            mix.options({ assetModules: false });
            mix.vue();
            mix.js(`test/fixtures/app/src/${dir}/app-with-vue-and-css.js`, 'js/app.js');

            const config = await webpack.buildConfig();
            const spy = sinon.spy();

            // TODO: This is basically a copy of the module code in the Vue.js file
            // That's not so great…
            for (const rule of (config.module && config.module.rules) || []) {
                if (typeof rule !== 'object') {
                    continue;
                }

                let loaders = (rule && rule.use) || [];

                if (!Array.isArray(loaders)) {
                    continue;
                }

                for (const loader of loaders) {
                    if (typeof loader !== 'object') {
                        continue;
                    }

                    // TODO: This isn't the best check
                    // We should check that the loader itself is correct
                    // Not that file-loader is anywhere in it's absolute path
                    // As this can produce false positives
                    if (
                        loader.loader &&
                        loader.loader.includes('file-loader') &&
                        loader.options
                    ) {
                        spy();

                        // @ts-ignore
                        t.falsy(loader.options.esModule);
                    }
                }
            }

            t.true(spy.called);
        }
    );
}

async function compilerSpy(Mix) {
    const compiler = await import(pathToFileURL(Mix.resolve('vue-compiler')).toString());
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
