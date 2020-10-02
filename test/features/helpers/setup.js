let mix = require('../../../src/index');
let fs = require('fs-extra');
let ComponentRegistrar = require('../../../src/components/ComponentRegistrar');
let mockRequire = require('mock-require');

global.WebpackConfig = require('../../../src/builder/WebpackConfig');
global.test = require('ava');

test.beforeEach(t => {
    // Reset state.
    global.Config = require('../../../src/config')();
    global.Mix = new (require('../../../src/Mix'))();

    require('../../../src/Chunks').Chunks.reset();

    fs.ensureDirSync('test/fixtures/fake-app/public');

    mix.setPublicPath('test/fixtures/fake-app/public');

    new ComponentRegistrar().addMany();
});

test.afterEach.always(t => {
    fs.removeSync('test/fixtures/fake-app/public');
});

global.setupVueAliases = version => {
    const vueModule = version === 3 ? 'vue3' : 'vue2';
    const vueLoaderModule = version === 3 ? 'vue-loader16' : 'vue-loader15';

    mockRequire('vue', vueModule);
    mockRequire('vue-loader', vueLoaderModule);

    mix.alias({ vue: require.resolve(vueModule) });

    mix.webpackConfig({
        resolveLoader: {
            alias: {
                'vue-loader': vueLoaderModule
            }
        }
    });
};

module.exports = mix;
