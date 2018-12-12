import mix from './helpers/setup';
import SassComponent from '../../src/components/Sass';

test.serial('mix.sass() requires the sass dependency by default.', t => {
    Mix.seesNpmPackage = npmPackage => {
        if (npmPackage === 'node-sass') return false;
    };

    let component = new SassComponent();

    t.true(component.dependencies().includes('sass'));
    t.false(component.dependencies().includes('node-sass'));
});

test.serial(
    'mix.sass() requires node-sass dependency if the user has installed it.',
    t => {
        let component = new SassComponent();

        Mix.seesNpmPackage = npmPackage => {
            if (npmPackage === 'node-sass') return true;
        };

        component.dependencies();

        t.true(component.dependencies().includes('node-sass'));
        t.false(component.dependencies().includes('sass'));
    }
);

test.cb.serial('it compiles Sass without JS', t => {
    mix.sass('test/fixtures/fake-app/resources/assets/sass/app.scss', 'css');

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));

        t.deepEqual(
            {
                '/css/app.css': '/css/app.css'
            },
            readManifest()
        );
    });
});

test.serial('JS and Sass + Less + Stylus compilation config', t => {
    mix.js('resources/assets/js/app.js', 'js')
        .sass('resources/assets/sass/sass.scss', 'css')
        .less('resources/assets/less/less.less', 'css')
        .stylus('resources/assets/stylus/stylus.styl', 'css');

    t.deepEqual(
        {
            '/js/app': [
                path.resolve('resources/assets/js/app.js'),
                path.resolve('resources/assets/less/less.less'),
                path.resolve('resources/assets/sass/sass.scss'),
                path.resolve('resources/assets/stylus/stylus.styl')
            ]
        },
        buildConfig().entry
    );
});

test.serial('Generic Sass rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.scss$/';
        })
    );
});

test.serial('Generic Less rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.less$/';
        })
    );
});

test.serial('Generic CSS rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.css$/';
        })
    );
});

test.serial('Generic Stylus rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.styl(us)?$/';
        })
    );
});

test.serial(
    'Unique PostCSS plugins can be applied for each mix.sass/less/stylus() call.',
    t => {
        mix.sass(
            'test/fixtures/fake-app/resources/assets/sass/app.scss',
            'css',
            {},
            [{ postcssPlugin: 'postcss-plugin-stub' }]
        );

        mix.sass(
            'test/fixtures/fake-app/resources/assets/sass/app2.scss',
            'css',
            {},
            [{ postcssPlugin: 'second-postcss-plugin-stub' }]
        );

        let seePostCssPluginFor = (file, pluginName) => {
            t.true(
                buildConfig()
                    .module.rules.find(rule =>
                        rule.test.toString().includes(file)
                    )
                    .use.find(loader => loader.loader === 'postcss-loader')
                    .options.plugins.find(
                        plugin => plugin.postcssPlugin === pluginName
                    ) !== undefined
            );
        };

        seePostCssPluginFor('app.scss', 'postcss-plugin-stub');
        seePostCssPluginFor('app2.scss', 'second-postcss-plugin-stub');
    }
);

test.cb.serial('cssnano minifier options may be specified', t => {
    Config.production = true;

    let file = new File(
        'test/fixtures/fake-app/resources/assets/sass/minifier-example.scss'
    );

    file.write(`
        .test {
            font-family: 'Font Awesome 5 Free';
        }
    `);

    mix.sass(file.relativePath(), 'css');

    mix.options({
        cssNano: { minifyFontValues: false }
    });

    compile(t, () => {
        t.is(
            '.test{font-family:"Font Awesome 5 Free"}',
            File.find(
                'test/fixtures/fake-app/public/css/minifier-example.css'
            ).read()
        );

        // Clean up.
        file.delete();
    });
});
