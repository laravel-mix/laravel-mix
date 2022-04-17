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
     * The name used to call this component.
     *
     * @deprecated
     **/
    caller = '';

    /**
     *
     * @param {import("../Build/BuildContext").BuildContext} context
     */
    constructor(context) {
        this.context = context;
    }

    /**
     * Specify one or more dependencies that must
     * be installed for this component to work
     *
     * @returns {import("../PackageDependency.js").Dependency[]}
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
