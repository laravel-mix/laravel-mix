import mix from './helpers/setup';

test.cb.serial('the kitchen sink', t => {
    new File('test/fixtures/fake-app/public/file.js').write('var foo');

    mix
        .js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
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
                '/js/vendor.js': '/js/vendor.js?id=ff8afbea128fd1834d3a',
                '/js/app.js': '/js/app.js?id=923f57b295c06628d87d',
                '/css/app.css': '/css/app.css?id=2d4a1c0cca02e0a221b2',
                '/css/example.css': '/css/example.css?id=b406ac87d7af027cfc27',
                '/js/another.js': '/js/another.js?id=d403c9f3f581bbcba8ba',
                '/js/manifest.js': '/js/manifest.js?id=7c0a19fb1a3afbe0a6cb',
                '/somewhere/app.js':
                    '/somewhere/app.js?id=923f57b295c06628d87d',
                '/js/all.js': '/js/all.js?id=0d9f8b7df5830cc6ec5a',
                '/file.js': '/file.js?id=2b319ddc541b0d2f5d70'
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
