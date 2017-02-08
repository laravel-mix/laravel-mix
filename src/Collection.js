class Collection {
    /**
     * Create a new Collection instance.
     *
     * @param {object} items
     */
    constructor(items = {}) {
        this.items = items;
    }


    /**
     * Add a new key-value pair to the collection.
     *
     * @param {string}       name
     * @param {string|Array} files
     */
    add(name, files) {
        if (! this.items[name]) {
            this.items[name] = [];
        }

        this.items[name] = this.items[name].concat(files);
    }


    /**
     * Get the underlying items for the collection.
     *
     * @return {Array}
     */
    get() {
        return this.items;
    }


    /**
     * Empty the collection.
     */
    empty() {
        this.items = {};

        return this;
    }
}

module.exports = Collection;
