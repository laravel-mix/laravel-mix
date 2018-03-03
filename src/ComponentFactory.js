let mix = require('../src/index');
let Verify = require('../src/Verify');
let webpackMerge = require('webpack-merge');

let components = [
    'FastSass',
    'Less',
    'Sass',
    'Stylus',
    'PostCss',
    'Browsersync',
    'JavaScript',
    'Preact',
    'React',
    'TypeScript',
    'Autoloading',
    'Versioning',
    'Extend'
];

class ComponentFactory {
    installAll() {
        components
            .map(name => require('../src/components/' + name))
            .forEach(this.install.bind(this));
    }

    install(Component) {
        let component =
            typeof Component === 'function' ? new Component() : Component;

        this.registerComponent(component);

        Mix.listen('init', () => {
            if (!component.activated) {
                return;
            }

            component.dependencies && this.installDependencies(component);
            component.babelConfig && this.applyBabelConfig(component);

            Mix.listen('loading-entry', entry => {
                if (component.webpackEntry) {
                    component.webpackEntry(entry);
                }
            });

            Mix.listen('loading-rules', rules => {
                component.webpackRules && this.applyRules(rules, component);
            });

            Mix.listen('loading-plugins', plugins => {
                component.webpackPlugins &&
                    this.applyPlugins(plugins, component);
            });

            Mix.listen('configReady', config => {
                component.webpackConfig && component.webpackConfig(config);
            });
        });
    }

    registerComponent(component) {
        []
            .concat(
                typeof component.name === 'function'
                    ? component.name()
                    : component.constructor.name.toLowerCase()
            )
            .forEach(name => {
                mix[name] = (...args) => {
                    component.register(...args);

                    component.activated = true;

                    return mix;
                };
            });
    }

    installDependencies(component) {
        []
            .concat(component.dependencies())
            .filter(dependency => dependency)
            .forEach(dependency =>
                Verify.dependency(dependency, !!component.requiresReload)
            );
    }

    applyBabelConfig(component) {
        Config.babelConfig = webpackMerge.smart(
            Config.babelConfig,
            component.babelConfig()
        );
    }

    applyRules(rules, component) {
        tap(component.webpackRules(), newRules => {
            newRules && rules.push(...[].concat(newRules));
        });
    }

    applyPlugins(plugins, component) {
        tap(component.webpackPlugins(), newPlugins => {
            newPlugins && plugins.push(...[].concat(newPlugins));
        });
    }
}

module.exports = ComponentFactory;
