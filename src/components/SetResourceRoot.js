class SetResourceRoot {
    register(path) {
        Config.resourceRoot = path;

        return this;
    }
}

module.exports = SetResourceRoot;
