const semver = require('semver');

class React {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        const dependencies = ['@babel/preset-react'];

        if (this.supportsFastRefreshing()) {
            return dependencies.concat([
                {
                    package: '@pmmmwh/react-refresh-webpack-plugin@^0.5.0-rc.0',
                    check: name =>
                        semver.satisfies(
                            require(`${name}/package.json`).version,
                            '^0.5.0-rc.0'
                        )
                },
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

        const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

        return new ReactRefreshPlugin({ overlay: { sockPath: 'ws' } });
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        const plugins = this.supportsFastRefreshing()
            ? [Mix.resolve('react-refresh/babel')]
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
        return Mix.isHot() && semver.satisfies(this.library().version, '>=16.9.0');
    }

    /**
     * Load the currently installed React library.
     */
    library() {
        return require('react');
    }
}

module.exports = React;
