import mix from './helpers/setup';

test.serial('it adds the Vue 2 resolve alias', t => {
    mix.vue({ version: 2, extractStyles: true });

    t.is('vue/dist/vue.esm.js', buildConfig().resolve.alias.vue$);
});

test.serial('it knows the Vue 2 compiler name', t => {
    mix.vue({ version: 2 });

    let dependencies = Mix.components.get('vue').dependencies();

    t.true(dependencies.includes('vue-template-compiler'));
});

test.serial.cb('it appends vue styles to your sass compiled file', t => {
    mix.vue({ version: 2, extractStyles: true });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-scss.js',
        'js/app.js'
    ).sass(
        'test/fixtures/fake-app/resources/assets/sass/app.scss',
        'css/app.css'
    );

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
        t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));

        let expected = `body {
  color: red;
}


.hello {
  color: blue;
}
`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/app.css').read()
        );
    });
});

test.serial.cb('it appends vue styles to your less compiled file', t => {
    mix.vue({ version: 2, extractStyles: true });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-scss.js',
        'js/app.js'
    ).less(
        'test/fixtures/fake-app/resources/assets/less/main.less',
        'css/app.css'
    );

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
        t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));

        let expected = `body {
  color: pink;
}

.hello {
  color: blue;
}
`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/app.css').read()
        );
    });
});

test.serial.cb(
    'it appends vue styles to a vue-styles.css file, if no preprocessor is used',
    t => {
        mix.vue({ version: 2, extractStyles: true });
        mix.js(
            'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-scss.js',
            'js/app.js'
        );

        compile(t, () => {
            t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
            t.true(
                File.exists('test/fixtures/fake-app/public/css/vue-styles.css')
            );

            let expected = `.hello {
  color: blue;
}
`;

            t.is(
                expected,
                File.find(
                    'test/fixtures/fake-app/public/css/vue-styles.css'
                ).read()
            );
        });
    }
);

test.serial.cb('it extracts vue vanilla CSS styles to a dedicated file', t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-css.js',
        'js/app.js'
    );

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/css/components.css'));

        let expected = `
.hello {
    color: green;
}

`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/components.css').read()
        );
    });
});

test.serial.cb('it extracts vue Stylus styles to a dedicated file', t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-stylus.js',
        'js/app.js'
    );

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/css/components.css'));

        let expected = `.hello {
  margin: 10px;
}

`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/components.css').read()
        );
    });
});

test.serial(
    'it does also add the vue webpack rules with typescript component',
    t => {
        mix.vue({ version: 2 });
        mix.ts('resources/assets/js/app.js', 'public/js');

        t.truthy(
            buildConfig().module.rules.find(
                rule => rule.test.toString() === '/\\.vue$/'
            )
        );
    }
);

test.serial.cb('it extracts vue .scss styles to a dedicated file', t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-scss.js',
        'js/app.js'
    ).sass(
        'test/fixtures/fake-app/resources/assets/sass/app.scss',
        'css/app.css'
    );

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
        t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));
        t.true(File.exists('test/fixtures/fake-app/public/css/components.css'));

        let expected = `body {
  color: red;
}


`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/app.css').read()
        );

        expected = `.hello {
  color: blue;
}
`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/components.css').read()
        );
    });
});

test.serial.cb('it extracts vue .sass styles to a dedicated file', t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-indented-sass.js',
        'js/app.js'
    ).sass(
        'test/fixtures/fake-app/resources/assets/sass/app.scss',
        'css/app.css'
    );

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
        t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));
        t.true(File.exists('test/fixtures/fake-app/public/css/components.css'));

        let expected = `body {
  color: red;
}


`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/app.css').read()
        );

        expected = `.hello {
  color: black;
}
`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/components.css').read()
        );
    });
});

test.serial.cb('it extracts vue PostCSS styles to a dedicated file', t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-postcss.js',
        'js/app.js'
    );

    compile(t, config => {
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

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/components.css').read()
        );
    });
});

test.serial.cb('it extracts vue Less styles to a dedicated file', t => {
    mix.vue({ version: 2, extractStyles: 'css/components.css' });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-less.js',
        'js/app.js'
    );

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/css/components.css'));

        let expected = `.hello {
  color: blue;
}

`;

        t.is(
            expected,
            File.find('test/fixtures/fake-app/public/css/components.css').read()
        );
    });
});

test.serial.cb('it supports global Vue styles for sass', t => {
    mix.vue({
        version: 2,
        extractStyles: 'css/components.css',
        globalStyles: {
            css: ['test/fixtures/fake-app/resources/assets/css/global.css'],
            sass: ['test/fixtures/fake-app/resources/assets/sass/global.sass'],
            scss: ['test/fixtures/fake-app/resources/assets/sass/global.scss'],
            less: ['test/fixtures/fake-app/resources/assets/less/global.less'],
            stylus: [
                'test/fixtures/fake-app/resources/assets/stylus/global.styl'
            ]
        }
    });
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue-and-global-styles.js',
        'js/app.js'
    );
    mix.sass(
        'test/fixtures/fake-app/resources/assets/sass/app.scss',
        'css/app.css'
    );

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
        t.true(File.exists('test/fixtures/fake-app/public/css/components.css'));

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
            File.find('test/fixtures/fake-app/public/css/components.css')
                .read()
                .trim()
        );
    });
});
