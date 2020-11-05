class Before {
    /**
     * Register the component.
     *
     * @param  {Function} callback
     * @return {void}
     */
    register(callback) {
        Mix.listen('init', callback);
    }
}

module.exports = Before;
