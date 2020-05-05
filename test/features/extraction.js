import mix from './helpers/setup';

test.serial.cb('JS compilation with vendor extraction config', t => {
    mix.js(
        'test/fixtures/fake-app/resources/assets/extract/app.js',
        'js'
    ).extract(['vue'], 'js/libraries.js');

    compile(t, config => {
        t.true(File.exists('test/fixtures/fake-app/public/js/manifest.js'));
        t.true(File.exists('test/fixtures/fake-app/public/js/libraries.js'));
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));

        t.true(
            new File('test/fixtures/fake-app/public/js/libraries.js')
                .read()
                .includes('vue')
        );
    });
});

test.serial.cb(
    'vendor extraction with no requested JS compilation will still extract vendor libraries',
    t => {
        mix.extract(['vue']);

        compile(t, config => {
            t.true(File.exists('test/fixtures/fake-app/public/manifest.js'));
            t.true(File.exists('test/fixtures/fake-app/public/vendor.js'));

            t.true(
                new File('test/fixtures/fake-app/public/vendor.js')
                    .read()
                    .includes('vue')
            );
        });
    }
);

test.serial.cb(
    'JS compilation with vendor extraction with default config',
    t => {
        mix.js(
            'test/fixtures/fake-app/resources/assets/extract/app.js',
            'js'
        ).extract(['vue']);

        compile(t, config => {
            t.true(File.exists('test/fixtures/fake-app/public/js/manifest.js'));
            t.true(File.exists('test/fixtures/fake-app/public/js/vendor.js'));
            t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));

            t.true(
                new File('test/fixtures/fake-app/public/js/vendor.js')
                    .read()
                    .includes('vue')
            );
        });
    }
);

test.serial.cb('JS compilation with total vendor extraction', t => {
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
