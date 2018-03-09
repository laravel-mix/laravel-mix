import mix from './helpers/setup';

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
