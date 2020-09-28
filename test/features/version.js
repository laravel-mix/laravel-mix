import mix from './helpers/setup';
import fs from 'fs-extra';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';

test.serial(
    'it can version an entire directory or regex of files.',
    async t => {
        fs.ensureDirSync(`${fakeApp}/public/js/folder`);

        new File(`${fakeApp}/public/js/folder/one.js`).write('var one');
        new File(`${fakeApp}/public/js/folder/two.js`).write('var two');
        new File(`${fakeApp}/public/js/folder/three.js`).write('var three');

        mix.version(`${fakeApp}/public/js/folder`);

        await compile();

        assert.manifestEquals(
            {
                '/js/folder/one.js': '/js/folder/one.js\\?id=\\w{20}',
                '/js/folder/three.js': '/js/folder/three.js\\?id=\\w{20}',
                '/js/folder/two.js': '/js/folder/two.js\\?id=\\w{20}'
            },
            t
        );
    }
);

test.serial('it compiles JavaScript and Sass with versioning', async t => {
    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js')
        .sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css')
        .version();

    await compile();

    assert.manifestEquals(
        {
            '/css/app.css': '/css/app.css\\?id=\\w{20}',
            '/js/app.js': '/js/app.js\\?id=\\w{20}'
        },
        t
    );
});

test.serial('it can build for production with versioning', async t => {
    Config.production = true;
    t.true(Mix.inProduction());

    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js').version();

    await compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
});
