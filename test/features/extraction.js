import mix from './helpers/setup';

test.serial.cb('JS compilation with vendor extraction config', t => {
    mix.vue({ version: 2 })
    mix.js(
        'test/fixtures/fake-app/resources/assets/extract/app.js',
        'js'
    ).extract(['vue2'], 'js/libraries.js');

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/js/manifest.js'));
        t.true(File.exists('test/fixtures/fake-app/public/js/libraries.js'));
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));

        t.true(
            new File('test/fixtures/fake-app/public/js/libraries.js')
                .read()
                .includes('vue2')
        );
    });
});

test.serial.cb(
    'vendor extraction with no requested JS compilation will still extract vendor libraries',
    t => {
        mix.extract(['vue2']);

        compile(t, config => {
            t.true(File.exists('test/fixtures/fake-app/public/manifest.js'));
            t.true(File.exists('test/fixtures/fake-app/public/vendor.js'));

            t.true(
                new File('test/fixtures/fake-app/public/vendor.js')
                    .read()
                    .includes('vue2')
            );
        });
    }
);

test.serial.cb(
    'JS compilation with vendor extraction with default config',
    t => {
        mix.vue({ version: 2 })
        mix.js(
            'test/fixtures/fake-app/resources/assets/extract/app.js',
            'js'
        ).extract(['vue2']);

        compile(t, config => {
            t.true(File.exists('test/fixtures/fake-app/public/js/manifest.js'));
            t.true(File.exists('test/fixtures/fake-app/public/js/vendor.js'));
            t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));

            t.true(
                new File('test/fixtures/fake-app/public/js/vendor.js')
                    .read()
                    .includes('vue2')
            );
        });
    }
);

test.serial.cb('JS compilation with total vendor extraction', t => {
    mix.vue({ version: 2 })
    mix.js(
        'test/fixtures/fake-app/resources/assets/extract/app.js',
        'js'
    ).extract();

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/js/manifest.js'));
        t.true(File.exists('test/fixtures/fake-app/public/js/vendor.js'));
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
    });
});
