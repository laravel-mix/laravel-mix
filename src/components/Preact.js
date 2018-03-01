let JavaScript = require('./JavaScript');

class Preact extends JavaScript {
    dependencies() {
        return ['babel-preset-preact'].concat(super.dependencies());
    }

    babelConfig() {
        return {
            presets: ['preact']
        };
    }
}

module.exports = Preact;
