import mix from './helpers/setup';
import fs from 'fs-extra';

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

test.cb.serial('it compiles JavaScript and Sass with versioning', t => {
    mix.js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
        .sass('test/fixtures/fake-app/resources/assets/sass/app.scss', 'css')
        .version();

    compile(t, () => {
        let manifest = readManifest();

        assertManifestIs(
            {
                '/css/app.css': '/css/app.css\\?id=\\w{20}',
                '/js/app.js': '/js/app.js\\?id=\\w{20}'
            },
            t
        );
    });
});
