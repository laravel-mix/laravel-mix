import mockRequire from 'mock-require';

/** @type {any} */
let originalBabelLoader;

export async function recordConfigs() {
    originalBabelLoader = originalBabelLoader || (await import('babel-loader'));

    return recordConfigsImpl(originalBabelLoader);
}

/**
 * @param {any} loader
 */
export function recordConfigsImpl(loader) {
    /** @type {Record<string,import("@babel/core").PartialConfig>} config */
    const resolvedConfigs = {};
    const customLoader = loader.custom(function () {
        return {
            /** @param {import("@babel/core").PartialConfig} config */
            config(config) {
                // @ts-ignore
                resolvedConfigs[this.resourcePath] = config;

                return config.options;
            }
        };
    });

    mockRequire('babel-loader', customLoader);

    /**
     *
     * @param {keyof import('@babel/core').TransformOptions} key
     * @returns {import('@babel/core').ConfigItem[]}
     */
    function getConfigItems(key) {
        const tmp = [];

        for (const config of Object.values(resolvedConfigs)) {
            // @ts-ignore
            tmp.push(...config.options[key]);
        }

        return tmp;
    }

    /**
     *
     * @param {keyof import('@babel/core').TransformOptions} key
     * @param {string} name
     * @returns {import('@babel/core').ConfigItem|null}
     */
    function getConfigItem(key, name) {
        for (const item of getConfigItems(key)) {
            if (item.file && item.file.request === name) {
                return item;
            }
        }

        return null;
    }

    return {
        getConfigs: () => ({ ...resolvedConfigs }),

        getPresets: () => getConfigItems('presets'),
        getPlugins: () => getConfigItems('plugins'),

        /** @param {string} name */
        getPreset: name => getConfigItem('presets', name),

        /** @param {string} name */
        getPlugin: name => getConfigItem('plugins', name),

        /** @param {string} name */
        hasPreset: name => getConfigItem('presets', name) !== null,

        /** @param {string} name */
        hasPlugin: name => getConfigItem('plugins', name) !== null
    };
}
