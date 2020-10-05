class When {
    register(condition, callback) {
        if (condition) {
            callback(this);
        }

        return this;
    }
}

module.exports = When;
