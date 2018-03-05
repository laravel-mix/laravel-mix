import test from 'ava';
import mix from '../../src/index';
import webpack from 'webpack';
import WebpackConfig from '../../src/builder/WebpackConfig';
import fs from 'fs-extra';
import ComponentFactory from '../../src/ComponentFactory';

test.beforeEach(t => {
    // Reset state.
    global.Config = require('../../src/config')();
    global.Mix = new (require('../../src/Mix'))();

    fs.ensureDirSync('test/fixtures/fake-app/public');

    mix.setPublicPath('test/fixtures/fake-app/public');

    new ComponentFactory().installAll();
});

test.afterEach.always(t => {
    fs.removeSync('test/fixtures/fake-app/public');
});

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
    mix
        .js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
        .sass('test/fixtures/fake-app/resources/assets/sass/app.scss', 'css');

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

test.cb('it compiles Sass without JS', t => {
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

test.cb.serial('it compiles JavaScript and Sass with versioning', t => {
    mix
        .js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
        .sass('test/fixtures/fake-app/resources/assets/sass/app.scss', 'css')
        .version();

    compile(t, () => {
        let manifest = readManifest();

        assertManifestIs(
            {
                '/js/app.js': '/js/app.js\\?id=\\w{20}',
                '/css/app.css': '/css/app.css\\?id=\\w{20}'
            },
            t
        );
    });
});

test.cb.serial(
    'it compiles JavaScript and copies the output to a new location.',
    t => {
        mix
            .js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
            .copy(
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

test.cb.serial('it compiles JS and then combines the bundles files.', t => {
    mix
        .js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
        .js('test/fixtures/fake-app/resources/assets/js/another.js', 'js')
        .scripts(
            [
                'test/fixtures/fake-app/public/js/app.js',
                'test/fixtures/fake-app/public/js/another.js'
            ],
            'test/fixtures/fake-app/public/js/all.js'
        );

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/all.js'));

        t.deepEqual(
            {
                '/js/app.js': '/js/app.js',
                '/js/another.js': '/js/another.js',
                '/js/all.js': '/js/all.js'
            },
            readManifest()
        );
    });
});

test.cb.serial('it combines a folder of scripts', t => {
    let output = 'test/fixtures/fake-app/public/all.js';

    mix.scripts('test/fixtures/fake-app/resources/assets/js', output);

    compile(t, () => {
        t.true(File.exists(output));

        t.is(
            "alert('another stub');\n\nalert('stub');\n",
            File.find(output).read()
        );
    });
});

test.cb.serial('it handles library autoloading', t => {
    mix.autoload({
        jquery: ['$', 'window.jQuery']
    });

    compile(t, config => {
        let providePlugin = config.plugins.find(
            plugin => plugin.constructor.name === 'ProvidePlugin'
        );

        t.deepEqual(
            {
                $: 'jquery',
                'window.jQuery': 'jquery'
            },
            providePlugin.definitions
        );
    });
});

test.cb.serial('it can minify a file', t => {
    mix
        .js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
        .minify('test/fixtures/fake-app/public/js/app.js');

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.min.js'));

        t.deepEqual(
            {
                '/js/app.js': '/js/app.js',
                '/js/app.min.js': '/js/app.min.js'
            },
            readManifest()
        );
    });
});

test.cb.serial('it can version an entire directory or regex of files.', t => {
    fs.ensureDirSync('test/fixtures/fake-app/public/js/folder');

    new File('test/fixtures/fake-app/public/js/folder/one.js').write('var one');
    new File('test/fixtures/fake-app/public/js/folder/two.js').write('var two');
    new File('test/fixtures/fake-app/public/js/folder/three.js').write(
        'var three'
    );

    mix.version('test/fixtures/fake-app/public/js/folder');

    compile(t, () => {
        assertManifestIs(
            {
                '/js/folder/one.js': '/js/folder/one.js\\?id=\\w{20}',
                '/js/folder/three.js': '/js/folder/three.js\\?id=\\w{20}',
                '/js/folder/two.js': '/js/folder/two.js\\?id=\\w{20}'
            },
            t
        );
    });
});

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
                '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
                '/js/app.js': '/js/app.js\\?id=\\w{20}',
                '/css/app.css': '/css/app.css\\?id=\\w{20}',
                '/css/example.css': '/css/example.css\\?id=\\w{20}',
                '/js/another.js': '/js/another.js\\?id=\\w{20}',
                '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
                '/somewhere/app.js': '/somewhere/app.js\\?id=\\w{20}',
                '/js/all.js': '/js/all.js\\?id=\\w{20}',
                '/file.js': '/file.js\\?id=\\w{20}'
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

test.cb('it extracts vue styles correctly', t => {
    mix
        .js(
            'test/fixtures/fake-app/resources/assets/vue/app-with-vue.js',
            'js/app.js'
        )
        .sass(
            'test/fixtures/fake-app/resources/assets/sass/app.scss',
            'css/app.css'
        )
        .options({ extractVueStyles: 'css/components.css' });

    compile(t, () => {
        t.true(File.exists('test/fixtures/fake-app/public/js/app.js'));
        t.true(File.exists('test/fixtures/fake-app/public/css/app.css'));
        t.true(File.exists('test/fixtures/fake-app/public/css/components.css'));
    });
});

test.cb('it displays OS notifications', t => {
    compile(t, config => {
        // Find the webpack-notifier plugin. (Yeah, a little awkward...)
        let plugin = config.plugins.find(
            plugin => plugin.options && plugin.options.alwaysNotify === true
        );

        t.truthy(plugin);
    });
});

test.cb('it disables OS notifications', t => {
    mix.disableNotifications();

    compile(t, config => {
        // Find the webpack-notifier plugin. (Yeah, a little awkward...)
        let plugin = config.plugins.find(
            plugin => plugin.options && plugin.options.alwaysNotify === true
        );

        t.falsy(plugin);
    });
});

test.cb('it disables OS success notifications', t => {
    mix.disableSuccessNotifications();

    compile(t, config => {
        // Find the webpack-notifier plugin. (Yeah, a little awkward...)
        let plugin = config.plugins.find(
            // To disable success notifications, we only have to set the alwaysNotify
            // option on the webpack plugin to false.
            plugin => plugin.options && plugin.options.alwaysNotify === false
        );

        t.truthy(plugin);
    });
});

function compile(t, callback) {
    Mix.dispatch('init');

    let config = new WebpackConfig().build();

    webpack(config, function(err, stats) {
        callback(config);

        t.end();
    });
}

function readManifest() {
    return JSON.parse(
        File.find('test/fixtures/fake-app/public/mix-manifest.json').read()
    );
}

function assertManifestIs(expected, t) {
    let manifest = readManifest();

    t.deepEqual(Object.keys(manifest), Object.keys(expected));

    Object.keys(expected).forEach(key => {
        t.true(new RegExp(expected[key]).test(manifest[key]));
    });
}
