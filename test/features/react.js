import mix from './helpers/setup';

test.serial('mix.react()', t => {
    let response = mix.react('resources/assets/js/app.js', 'public/js');

    t.is(mix, response);

    t.deepEqual(
        [
            {
                entry: [new File('resources/assets/js/app.js')],
                output: new File('public/js')
            }
        ],
        Mix.components.get('react').toCompile
    );
});

test.cb.serial('it compiles React and a preprocessor properly', t => {
    mix.react('test/fixtures/fake-app/resources/assets/js/app.js', 'js').sass(
        'test/fixtures/fake-app/resources/assets/sass/app.scss',
        'css'
    );

    compile(t, config => {
        assertManifestIs(
            {
                '/css/app.css': '/css/app.css',
                '/js/app.js': '/js/app.js'
            },
            t
        );

        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
    });
});

test.serial('it sets the webpack entry correctly', t => {
    mix.react('resources/assets/js/app.js', 'js');

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')]
        },
        buildConfig().entry
    );
});

test.serial('it sets the babel config correctly', t => {
    mix.react('resources/assets/js/app.js', 'js');

    buildConfig();

    t.true(
        Config.babel().presets.find(p =>
            p.includes(path.normalize('@babel/preset-react'))
        ) !== undefined
    );
});
