let path = require('path');

class SetPublicPath {
    register(defaultPath) {
        Config.publicPath = path.normalize(defaultPath.replace(/\/$/, ''));

        return this;
    }
}

module.exports = SetPublicPath;
