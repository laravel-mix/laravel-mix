class React {
    /**
     * Required dependencies for the component.
     */

    supportFastRefresh() {
        try {
            const semver = require('semver');
            const react = require('react');

            return Mix.isHot() && semver.satisfies(react.version, '>=16.9.0');
        } catch {
            return false;
        }
    }

    dependencies() {
        const dependencies = ['@babel/preset-react'];

        if (this.supportFastRefresh()) {
            return dependencies.concat([
                '@pmmmwh/react-refresh-webpack-plugin',
                'react-refresh'
            ]);
        }

        return dependencies;
    }

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

    webpackPlugins() {
        if (!this.supportFastRefresh()) {
            return [];
        }

        const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

        return new ReactRefreshWebpackPlugin();
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        const plugins = this.supportFastRefresh()
            ? [require.resolve('react-refresh/babel')]
            : [];

        return {
            presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            plugins
        };
    }
}

module.exports = React;
