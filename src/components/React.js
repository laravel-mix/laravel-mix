class React {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        const dependencies = ['@babel/preset-react'];

        if (this.supportsFastRefreshing()) {
            return dependencies.concat([
                '@pmmmwh/react-refresh-webpack-plugin',
                'react-refresh'
            ]);
        }

        return dependencies;
    }

    /**
     * Register the component.
     */
    register() {
        if (
            arguments.length === 2 &&
            typeof arguments[0] === 'string' &&
            typeof arguments[1] === 'string'
        ) {
            throw new Error(
                'mix.react() is now a feature flag. Use mix.js(source, destination).react() instead'
            );
        }
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        if (!this.supportsFastRefreshing()) {
            return [];
        }

        const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

        return new ReactRefreshWebpackPlugin();
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        const plugins = this.supportsFastRefreshing()
            ? [require.resolve('react-refresh/babel')]
            : [];

        return {
            presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            plugins
        };
    }

    /**
     * Determine if the React version supports fast refreshing.
     */
    supportsFastRefreshing() {
        try {
            const semver = require('semver');

            return Mix.isHot() && semver.satisfies(this.library().version, '>=16.9.0');
        } catch {
            return false;
        }
    }

    /**
     * Load the currently installed React library.
     */
    library() {
        return require('react');
    }
}

module.exports = React;
