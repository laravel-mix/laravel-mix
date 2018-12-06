let mix = require('../../../src/index');
let fs = require('fs-extra');
let ComponentFactory = require('../../../src/components/ComponentFactory');
let webpack = require('webpack');

global.WebpackConfig = require('../../../src/builder/WebpackConfig');
global.test = require('ava');

test.beforeEach(t => {
    // Reset state.
    global.Config = require('../../../src/config')();
    global.Mix = new (require('../../../src/Mix'))();

    fs.ensureDirSync('test/fixtures/fake-app/public');

    mix.setPublicPath('test/fixtures/fake-app/public');

    new ComponentFactory().installAll();
});

test.afterEach.always(t => {
    fs.removeSync('test/fixtures/fake-app/public');
});

global.compile = (t, callback) => {
    let config = buildConfig();

    webpack(config, function(err, stats) {
        callback(config);

        t.end();
    });
};

global.buildConfig = () => {
    Mix.dispatch('init');

    return new WebpackConfig().build();
};

global.readManifest = () => {
    return JSON.parse(
        File.find('test/fixtures/fake-app/public/mix-manifest.json').read()
    );
};

global.assertManifestIs = (expected, t) => {
    let manifest = readManifest();

    t.deepEqual(Object.keys(manifest).sort(), Object.keys(expected).sort());

    Object.keys(expected).forEach(key => {
        t.true(new RegExp(expected[key]).test(manifest[key]));
    });
};

module.exports = mix;
