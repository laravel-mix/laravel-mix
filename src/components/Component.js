/**
 * @abstract
 * @internal (for now)
 **/
class Component {
    /** Whether or not to automatically register this component */
    passive = false;

    /** Whether or not this component requires dependency reloading */
    requiresReload = false;

    /**
     *
     * @param {import("../Mix")} mix
     */
    constructor(mix) {
        this.context = mix;
    }

    /**
     * Specifiy one or more dependencies that must
     * be installed for this component to work
     *
     * @protected
     * @returns {import("../Dependencies").Dependency[]}
     **/
    dependencies() {
        return [];
    }

    /**
     * Add rules to the webpack config
     *
     * @returns {import('webpack').RuleSetRule[]}
     **/
    webpackRules() {
        return [];
    }

    /**
     * Add plugins to the webpack config
     *
     * @returns {import('webpack').WebpackPluginInstance[]}
     **/
    webpackPlugins() {
        return [];
    }

    /**
     * Update the webpack config
     *
     * @param {import('webpack').Configuration} config
     * @returns {import('webpack').Configuration}
     **/
    webpackConfig(config) {
        return config;
    }
}

module.exports.Component = Component;
