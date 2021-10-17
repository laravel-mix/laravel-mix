const fs = require('fs/promises');

exports.Manifest = class Manifest {
    /** @param {Record<string, string>} records */
    constructor(records = {}) {
        this.records = records;
    }

    /**
     * @param {string} filepath
     */
    static async read(filepath) {
        const content = await fs.readFile(filepath, { encoding: 'utf-8' });
        const records = JSON.parse(content);

        // TODO: Verify that the json is Record<string, string>

        return new Manifest(records);
    }

    get() {
        return Object.fromEntries(
            Object.entries(this.records).sort((a, b) => a[0].localeCompare(b[0]))
        );
    }

    /**
     * @param {string} filepath
     */
    async write(filepath) {
        await fs.writeFile(filepath, JSON.stringify(this.get()));
    }
};
