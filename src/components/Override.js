class Override {
    register(callback) {
        Mix.listen('configReadyForUser', callback);

        return this;
    }
}

module.exports = Override;
