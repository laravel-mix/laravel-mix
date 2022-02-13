import path from 'path';
import { pathToFileURL, URL } from 'url';
import { createRequire } from 'module';

export class ConfigLoader {
    /**
     * @param {string} basePath
     */
    constructor(basePath) {
        this.basePath = basePath;
    }

    /**
     * Load the user's Mix config
     */
    async load() {
        const configPath = await this.locate();

        // TODO: Add test for this
        if (configPath === null) {
            throw new Error('Unable to find Mix config file');
        }

        // Pull in the user's mix config file
        // An ESM import here allows a user's mix config
        // to be an ESM module and use top-level await
        return await import(configPath);
    }

    /**
     * Determine the path to the user's webpack.mix.js file.
     *
     * @internal
     * @returns {Promise<URL|null>}
     */
    async locate() {
        for (const location of await this.possibleLocations()) {
            if (location) {
                return pathToFileURL(location);
            }
        }

        return null;
    }

    async possibleLocations() {
        return await Promise.all(
            this.possibleNames().map(filepath => this.find(filepath))
        );
    }

    possibleNames() {
        if (process.env.MIX_FILE) {
            return [
                process.env.MIX_FILE,
                `${process.env.MIX_FILE}.mjs`,
                `${process.env.MIX_FILE}.cjs`,
                `${process.env.MIX_FILE}.js`
            ];
        }

        return ['webpack.mix.mjs', 'webpack.mix.cjs', 'webpack.mix.js'];
    }

    /**
     * TODO: Should we use `mix.resolve` here so it can be mocked?
     *
     * @param {string} name
     * @returns {Promise<string|null>}
     */
    async find(name) {
        try {
            const require = createRequire(import.meta.url);

            return require.resolve(path.resolve(this.basePath, name));
        } catch (err) {
            return null;
        }
    }
}
