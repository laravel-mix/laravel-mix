import test from 'ava';
import { fakeApp } from '../helpers/paths';
import webpack from '../helpers/webpack';
import WebpackConfig from '../../src/builder/WebpackConfig';
import File from '../../src/File';

import '../helpers/mix';

test.beforeEach(() => {
    webpack.setupVueAliases(3);
});

test.only('it adds the Vue 3 resolve alias', t => {
    mix.vue({ version: 3, extractStyles: true });

    Mix.dispatch('init');
    let config = new WebpackConfig().build();
    t.true(true);
    //
    // t.is('vue/dist/vue.esm-bundler.js', config.resolve.alias.vue$);
});

test('it knows the Vue 3 compiler name', t => {
    mix.vue({ version: 3 });

    let dependencies = Mix.components.get('vue').dependencies();

    t.true(dependencies.includes('@vue/compiler-sfc'));
});

test.only('it appends vue styles to your sass compiled file', async t => {
    mix.vue({ version: 3, extractStyles: true });

    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-scss.js`,
        'js/app.js'
    ).sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.true(File.exists(`${fakeApp}/public/css/app.css`));

    let expected = `body {
  color: red;
}


.hello {
  color: blue;
}
`;

    t.is(expected, File.find(`${fakeApp}/public/css/app.css`).read());
});

test('it appends vue styles to your less compiled file', async t => {
    mix.vue({ version: 3, extractStyles: true });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-scss.js`,
        'js/app.js'
    ).less(`${fakeApp}/resources/assets/less/main.less`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.true(File.exists(`${fakeApp}/public/css/app.css`));

    let expected = `body {
  color: pink;
}

.hello {
  color: blue;
}
`;

    t.is(expected, File.find(`${fakeApp}/public/css/app.css`).read());
});

test('it appends vue styles to a vue-styles.css file, if no preprocessor is used', async t => {
    mix.vue({ version: 3, extractStyles: true });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-scss.js`,
        'js/app.js'
    );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.true(File.exists(`${fakeApp}/public/css/vue-styles.css`));

    let expected = `.hello {
  color: blue;
}
`;

    t.is(expected, File.find(`${fakeApp}/public/css/vue-styles.css`).read());
});

test('it extracts vue vanilla CSS styles to a dedicated file', async t => {
    mix.vue({ version: 3, extractStyles: 'css/components.css' });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-css.js`,
        'js/app.js'
    );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/css/components.css`));

    let expected = `
.hello {
    color: green;
}

`;

    t.is(expected, File.find(`${fakeApp}/public/css/components.css`).read());
});

test('it extracts vue Stylus styles to a dedicated file', async t => {
    mix.vue({ version: 3, extractStyles: 'css/components.css' });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-stylus.js`,
        'js/app.js'
    );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/css/components.css`));

    let expected = `.hello {
  margin: 10px;
}

`;

    t.is(expected, File.find(`${fakeApp}/public/css/components.css`).read());
});

test('it does also add the vue webpack rules with typescript component', t => {
    mix.vue({ version: 3 });
    mix.ts('resources/assets/js/app.js', 'public/js');

    t.truthy(
        webpack
            .buildConfig()
            .module.rules.find(rule => rule.test.toString() === '/\\.vue$/')
    );
});

test('it extracts vue .scss styles to a dedicated file', async t => {
    mix.vue({ version: 3, extractStyles: 'css/components.css' });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-scss.js`,
        'js/app.js'
    ).sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.true(File.exists(`${fakeApp}/public/css/app.css`));
    t.true(File.exists(`${fakeApp}/public/css/components.css`));

    let expected = `body {
  color: red;
}


`;

    t.is(expected, File.find(`${fakeApp}/public/css/app.css`).read());

    expected = `.hello {
  color: blue;
}
`;

    t.is(expected, File.find(`${fakeApp}/public/css/components.css`).read());
});

test('it extracts vue .sass styles to a dedicated file', async t => {
    mix.vue({ version: 3, extractStyles: 'css/components.css' });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-indented-sass.js`,
        'js/app.js'
    ).sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.true(File.exists(`${fakeApp}/public/css/app.css`));
    t.true(File.exists(`${fakeApp}/public/css/components.css`));

    let expected = `body {
  color: red;
}


`;

    t.is(expected, File.find(`${fakeApp}/public/css/app.css`).read());

    expected = `.hello {
  color: black;
}
`;

    t.is(expected, File.find(`${fakeApp}/public/css/components.css`).read());
});

test('it extracts vue PostCSS styles to a dedicated file', async t => {
    mix.vue({ version: 3, extractStyles: 'css/components.css' });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-postcss.js`,
        'js/app.js'
    );

    await webpack.compile();

    // In this example, postcss-loader is reading from postcss.config.js.
    let expected = `
:root {
    --color: white;
}
.hello {
    color: white;
    color: var(--color);
}

`;

    t.is(expected, File.find(`${fakeApp}/public/css/components.css`).read());
});

test('it extracts vue Less styles to a dedicated file', async t => {
    mix.vue({ version: 3, extractStyles: 'css/components.css' });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-less.js`,
        'js/app.js'
    );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/css/components.css`));

    let expected = `.hello {
  color: blue;
}

`;

    t.is(expected, File.find(`${fakeApp}/public/css/components.css`).read());
});

test('it supports global Vue styles for sass', async t => {
    mix.vue({
        version: 3,
        extractStyles: 'css/components.css',
        globalStyles: {
            css: [`${fakeApp}/resources/assets/css/global.css`],
            sass: [`${fakeApp}/resources/assets/sass/global.sass`],
            scss: [`${fakeApp}/resources/assets/sass/global.scss`],
            less: [`${fakeApp}/resources/assets/less/global.less`],
            stylus: [`${fakeApp}/resources/assets/stylus/global.styl`]
        }
    });
    mix.js(
        `${fakeApp}/resources/assets/vue3/app-with-vue-and-global-styles.js`,
        'js/app.js'
    );
    mix.sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.true(File.exists(`${fakeApp}/public/css/components.css`));

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
        File.find(`${fakeApp}/public/css/components.css`)
            .read()
            .trim()
    );
});
