const { defineConfig } = require('../../../src/index.js');

module.exports.default = defineConfig(mix => {
    mix.setPublicPath('public');
});
