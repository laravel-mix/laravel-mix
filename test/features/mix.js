import mix from './helpers/setup';

test.cb.serial('the kitchen sink', t => {
    new File('test/fixtures/fake-app/public/file.js').write('var foo');

    mix.js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
        .extract(['vue'])
        .js('test/fixtures/fake-app/resources/assets/js/another.js', 'js')
        .sass('test/fixtures/fake-app/resources/assets/sass/app.scss', 'css')
        .postCss(
            'test/fixtures/fake-app/resources/assets/css/app.css',
            'css/example.css'
        )
        .copy(
            'test/fixtures/fake-app/public/js/app.js',
            'test/fixtures/fake-app/public/somewhere'
        )
        .scripts(
            [
                'test/fixtures/fake-app/public/somewhere/app.js',
                'test/fixtures/fake-app/public/js/another.js'
            ],
            'test/fixtures/fake-app/public/js/all.js'
        )
        .version(['test/fixtures/fake-app/public/file.js']);

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/all.js'));

        assertManifestIs(
            {
                '/js/another.js': '/js/another.js\\?id=\\w{20}',
                '/css/app.css': '/css/app.css\\?id=\\w{20}',
                '/css/example.css': '/css/example.css\\?id=\\w{20}',
                '/js/app.js': '/js/app.js\\?id=\\w{20}',
                '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
                '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
                '/somewhere/app.js': '/somewhere/app.js\\?id=\\w{20}',
                '/js/all.js': '/js/all.js\\?id=\\w{20}',
                '/file.js': '/file.js\\?id=\\w{20}'
            },
            t
        );
    });
});

test.cb.serial('async chunk splitting works', t => {
    mix.js('test/fixtures/fake-app/resources/assets/extract/app.js', 'js')
        .extract(['vue', 'lodash', 'core-js'])
        .options({
            babelConfig: {
                plugins: ['@babel/plugin-syntax-dynamic-import']
            }
        })
        .version();

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));

        assertManifestIs(
            {
                '/js/app.js': '/js/app.js\\?id=\\w{20}',
                '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
                '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
                '/js/split.js': '/js/split.js\\?id=\\w{20}',
                '/vendors~js/split.js': '/vendors~js/split.js\\?id=\\w{20}' // TODO: Do we want this?
            },
            t
        );
    });
});

test.cb.serial('multiple extractions work', t => {
    mix.js('test/fixtures/fake-app/resources/assets/extract/app.js', 'js')
        .extract(['vue', 'lodash'], 'js/vendor-vue-lodash.js')
        .extract(['core-js'], 'js/vendor-core-js.js')
        .options({
            babelConfig: {
                plugins: ['@babel/plugin-syntax-dynamic-import']
            }
        })
        .version();

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));

        assertManifestIs(
            {
                '/js/app.js': '/js/app.js\\?id=\\w{20}',
                '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
                '/js/vendor-core-js.js': '/js/vendor-core-js.js\\?id=\\w{20}',
                '/js/vendor-vue-lodash.js':
                    '/js/vendor-vue-lodash.js\\?id=\\w{20}',
                '/js/split.js': '/js/split.js\\?id=\\w{20}',
                '/vendors~js/split.js': '/vendors~js/split.js\\?id=\\w{20}' // TODO: Do we want this?
            },
            t
        );
    });
});

test.cb.serial(
    'it resolves image- and font-urls and distinguishes between them even if we deal with svg',
    t => {
        // Given we have a sass file that refers to ../font.svg, ../font/awesome.svg and to ../img/img.svg
        mix.sass(
            'test/fixtures/fake-app/resources/assets/sass/font-and-image.scss',
            'css'
        );
        // When we compile it
        compile(t, () => {
            // Then we expect the css to be built
            t.true(
                File.exists(
                    'test/fixtures/fake-app/public/css/font-and-image.css'
                )
            );
            // Along with the referred image in the images folder
            t.true(File.exists('test/fixtures/fake-app/public/images/img.svg'));
            // And the referred fonts in the fonts folder
            t.true(File.exists('test/fixtures/fake-app/public/fonts/font.svg'));
            t.true(
                File.exists('test/fixtures/fake-app/public/fonts/awesome.svg')
            );
            // And we expect the image NOT to be in the fonts folder:
            t.false(File.exists('test/fixtures/fake-app/public/fonts/img.svg'));
            // And the fonts NOT to be in the image folder
            t.false(
                File.exists('test/fixtures/fake-app/public/images/font.svg')
            );
            t.false(
                File.exists('test/fixtures/fake-app/public/images/awesome.svg')
            );
        });
    }
);
