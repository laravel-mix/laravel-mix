import test from 'ava';

import { context } from '../helpers/test.js';

/**
 * @template  MetadataType
 * @typedef {import('../helpers/TestContext.js').TestContext<MetadataType>} TestContext<MetadataType>
 **/

test.serial(
    'basic mix.postCss() compilation',
    buildTest({
        file: 'basic-compilation.css',
        input: `body { color: red; }`,
        expected: `body { color: red; }`
    })
);

test.serial(
    'mix.css() is an alias for mix.postCss()',
    buildTest({
        run: ({ mix }) => mix.css('stubs/basic-compilation.css', 'css'),

        file: 'basic-compilation.css',
        input: `body { color: red; }`,
        expected: `body { color: red; }`
    })
);

test.serial(
    'it applies autoprefixer to compiled CSS',
    buildTest({
        file: 'autoprefixer.css',
        input: `@keyframes testing { to { color: red; } }`,
        expected: `@keyframes testing { to { color: red; } }`
    })
);

test.serial(
    'it applies autoprefixer with custom configuration',
    buildTest({
        prepare: ({ mix }) => mix.options({ autoprefixer: {} }),

        file: 'autoprefixer.css',
        input: `div { box-shadow: 0 0 4px black; }`,
        expected: `div { box-shadow: 0 0 4px #000; }`
    })
);

test.serial(
    'it disables autoprefixer',
    buildTest({
        prepare: ({ mix }) => mix.options({ autoprefixer: false }),

        file: 'autoprefixer.css',
        input: `@keyframes testing { to { color: red; } }`,
        expected: `@keyframes testing { to { color: red; } }`
    })
);

test.serial(
    'it disables autoprefixer but still loads postcss.config.js',
    buildTest({
        prepare: ({ mix }) => mix.options({ autoprefixer: false }),

        plugins: ['postcss-custom-properties'],

        file: 'autoprefixer.css',

        input: `
        :root { --some-color: red; }
        .test { color: var(--some-color); }
        @keyframes testing { to { color: green; } }
    `,

        expected: `
        :root { --some-color: red; }
        .test { color: red; color: var(--some-color); }
        @keyframes testing { to { color: green; } }
    `
    })
);

test.serial(
    'it applies CSSNano minification during production',
    buildTest({
        prepare: ({ mix }) => mix.options({ production: true }),

        file: `cssnano.css`,
        input: `body { color: red; }`,
        expected: `body{color:red}`
    })
);

test.serial(
    'it disables CSSNano minification',
    buildTest({
        prepare: ({ mix }) => mix.options({ production: true, cssNano: false }),

        file: `cssnano.css`,
        input: `@keyframes testing { to { color: red; } }`,

        // The default for production mode is to minify the output,
        // but this test will disable that. When we do so, we still
        // expect any postcss.config.js plugin to be loaded.
        expected: `@keyframes testing { to { color: red; } }`
    })
);

test.serial(
    'it applies LightningCSS minification in production',
    buildTest({
        prepare: ({ mix }) => mix.options({ production: true }),

        file: `cssnano.css`,
        input: `.hello { color: blue; font-weight: bold; }`,
        expected: `.hello{color:#00f;font-weight:700}`
    })
);

test.serial(
    "it merges Mix's default postcss plugins with any found in the user's postcss.config.js.",
    buildTest({
        prepare: ({ mix }) => mix.options({ production: true }),

        plugins: ['postcss-custom-properties'],

        file: `minifier-example.css`,
        input: `
        :root { --some-color: red; }
        .test { color: var(--some-color); }
        @keyframes testing { to { color: green; } }
    `,

        // We expect postcss-custom-properties to expand vars, then LightningCSS to minify.
        expected: `
        :root { --some-color: red }
        .test { color: var(--some-color) }
        @keyframes testing { to { color: green } }
    `
    })
);

/**
 * @param {object} param0
 * @param {string} param0.file
 * @param {string} param0.input
 * @param {string} param0.expected
 * @param {string[]} [param0.plugins]
 * @param {(ctx: TestContext) => unknown | Promise<unknown>} [param0.run]
 * @param {(ctx: TestContext) => unknown | Promise<unknown>} [param0.prepare]
 */
function buildTest({
    file,
    input,
    expected,
    plugins = [],
    prepare = undefined,
    run = undefined
}) {
    /**
     * @param {import('ava').ExecutionContext} t
     */
    return async t => {
        const ctx = context(t);

        const { assert, mix, fs, webpack } = ctx;

        mix.setPublicPath('./');
        mix.options({ autoprefixer: {} });

        if (prepare) {
            const result = prepare(ctx);

            if (result instanceof Promise) {
                await result;
            }
        }

        const requires = plugins.map(plugin => `require('${plugin}')`).join(', ');

        await fs().stub({
            'postcss.config.cjs': `module.exports = { plugins: [ ${requires} ] };`,
            [`stubs/${file}`]: input
        });

        run = run || (({ mix }) => mix.postCss(`stubs/${file}`, 'css'));

        run(ctx);

        await webpack.compile();

        assert().file(`css/${file}`).exists();
        assert().file(`css/${file}`).matchesCss(expected);
    };
}
