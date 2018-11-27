import mix from './helpers/setup';

test.cb.serial('it compiles JavaScript', t => {
    mix.js('test/fixtures/fake-app/resources/assets/js/app.js', 'js');

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));

        t.deepEqual(
            {
                '/js/app.js': '/js/app.js'
            },
            readManifest()
        );
    });
});

test.cb.serial('it compiles JavaScript and Sass', t => {
    mix.js('test/fixtures/fake-app/resources/assets/js/app.js', 'js').sass(
        'test/fixtures/fake-app/resources/assets/sass/app.scss',
        'css'
    );

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
        t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));

        t.deepEqual(
            {
                '/js/app.js': '/js/app.js',
                '/css/app.css': '/css/app.css'
            },
            readManifest()
        );
    });
});

test.serial('basic JS compilation config.', t => {
    mix.js('resources/assets/js/app.js', 'js');

    let webpackConfig = buildConfig();

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')]
        },
        webpackConfig.entry
    );

    t.deepEqual(
        {
            path: path.resolve('test/fixtures/fake-app/public'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/'
        },
        webpackConfig.output
    );
});

test.serial(
    'basic JS compilation with output public directory omitted config.',
    t => {
        mix.js('resources/assets/js/app.js', 'js');

        t.deepEqual(
            {
                '/js/app': [path.resolve('resources/assets/js/app.js')]
            },
            buildConfig().entry
        );
    }
);

test.serial('basic JS compilation with a different public path', t => {
    mix.js('resources/assets/js/app.js', 'public/js').setPublicPath(
        'public-html'
    );

    t.deepEqual(
        {
            path: path.resolve('public-html'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/'
        },
        buildConfig().output
    );
});

test.serial('basic JS compilation with a specific output path config.', t => {
    mix.js('resources/assets/js/app.js', 'js/output.js');

    t.deepEqual(
        {
            '/js/output': [path.resolve('resources/assets/js/app.js')]
        },
        buildConfig().entry
    );
});

test.serial('mix.js()', t => {
    let response = mix.js('resources/assets/js/app.js', 'public/js');

    t.is(mix, response);

    let jsComponent = Mix.components.get('js');

    t.deepEqual(
        [
            {
                entry: [new File('resources/assets/js/app.js')],
                output: new File('public/js')
            }
        ],
        jsComponent.toCompile
    );

    mix.js(
        ['resources/assets/js/one.js', 'resources/assets/js/two.js'],
        'public/js'
    );

    t.deepEqual(
        [
            {
                entry: [new File('resources/assets/js/app.js')],
                output: new File('public/js')
            },
            {
                entry: [
                    new File('resources/assets/js/one.js'),
                    new File('resources/assets/js/two.js')
                ],
                output: new File('public/js')
            }
        ],
        jsComponent.toCompile
    );
});
