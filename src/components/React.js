let JavaScript = require('./JavaScript');

class React extends JavaScript {
    dependencies() {
        return ['babel-preset-react'].concat(super.dependencies());
    }

    register(entry, output) {
        Config.react = true;

        return super.register(entry, output);
    }
}

module.exports = React;
