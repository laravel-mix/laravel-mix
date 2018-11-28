import mix from './helpers/setup';

test.cb.serial(
    'it prepends vue styles to your sass/less/stylus compiled file',
    t => {
        mix.js(
            'test/fixtures/fake-app/resources/assets/vue/app-with-vue.js',
            'js/app.js'
        )
            .sass(
                'test/fixtures/fake-app/resources/assets/sass/app.scss',
                'css/app.css'
            )
            .options({ extractVueStyles: true });

        compile(t, () => {
            t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
            t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));

            let expected = `
.hello {
  color: blue;
}

body {
  color: red;
}

`;

            t.is(
                expected,
                File.find('test/fixtures/fake-app/public/css/app.css').read()
            );
        });
    }
);

test.cb.serial(
    'it appends vue styles to a vue-styles.css file, if no preprocessor is used',
    t => {
        mix.js(
            'test/fixtures/fake-app/resources/assets/vue/app-with-vue.js',
            'js/app.js'
        ).options({ extractVueStyles: true });

        compile(t, () => {
            t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
            t.true(
                File.exists('test/fixtures/fake-app/public/css/vue-styles.css')
            );

            let expected = `
.hello {
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

test.cb.serial('it extracts vue styles to a dedicated file', t => {
    mix.js(
        'test/fixtures/fake-app/resources/assets/vue/app-with-vue.js',
        'js/app.js'
    )
        .sass(
            'test/fixtures/fake-app/resources/assets/sass/app.scss',
            'css/app.css'
        )
        .options({ extractVueStyles: 'css/components.css' });

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

        expected = `
.hello {
  color: blue;
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
        mix.ts('resources/assets/js/app.js', 'public/js');

        t.truthy(
            buildConfig().module.rules.find(
                rule => rule.test.toString() === '/\\.vue$/'
            )
        );
    }
);
