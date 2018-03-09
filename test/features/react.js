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

    t.true(Config.babel().presets.includes('react'));
});
