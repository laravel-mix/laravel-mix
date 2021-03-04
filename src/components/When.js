class When {
    register(condition, callback) {
        if (condition) {
            callback(Mix.api);
        }
    }
}

module.exports = When;
