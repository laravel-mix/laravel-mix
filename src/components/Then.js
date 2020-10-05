class Then {
    register(callback) {
        Mix.listen('build', callback);

        return this;
    }
}

module.exports = Then;
