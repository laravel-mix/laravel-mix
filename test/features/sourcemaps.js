import mix from './helpers/setup';

test.serial('mix.sourceMaps()', t => {
    t.false(Config.sourcemaps);

    let response = mix.sourceMaps();

    // Sourcemaps should use a sensible type as the default for dev.
    t.is(mix, response);
    t.is('eval-source-map', Config.sourcemaps);

    // For production builds, we should use a more performant type.
    Config.production = true;
    mix.sourceMaps();
    t.is('source-map', Config.sourcemaps);

    // But if the user specifies that sourcemaps shouldn't be built for
    // production, then we should disable it.
    mix.sourceMaps(false);
    t.false(Config.sourcemaps);
});
