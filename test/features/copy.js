import mix from './helpers/setup';

test.serial('mix.copy()', t => {
    mix.copy('this/file.js', 'this/other/location.js');

    t.is(1, Mix.tasks.length);

    mix.copyDirectory('this/folder', 'this/other/folder');

    t.is(2, Mix.tasks.length);
});

test.cb.serial(
    'it compiles JavaScript and copies the output to a new location.',
    t => {
        mix.js('test/fixtures/fake-app/resources/assets/js/app.js', 'js').copy(
            'test/fixtures/fake-app/public/js/app.js',
            'test/fixtures/fake-app/public/somewhere'
        );

        compile(t, () => {
            t.true(
                File.exists('test/fixtures/fake-app/public/somewhere/app.js')
            );

            t.deepEqual(
                {
                    '/js/app.js': '/js/app.js',
                    '/somewhere/app.js': '/somewhere/app.js'
                },
                readManifest()
            );
        });
    }
);
