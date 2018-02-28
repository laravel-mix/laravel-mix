let JavaScript = require('./JavaScript');

class React extends JavaScript {
    dependencies() {
        return ['babel-preset-react'].concat(super.dependencies());
    }

    babelConfig() {
        return {
            presets: ['react']
        };
    }
}

module.exports = React;
