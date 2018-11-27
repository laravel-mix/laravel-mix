import mix from './helpers/setup';

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
            return rule.test.toString() === '/\\.s[ac]ss$/';
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
