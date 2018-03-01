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
            this.installDependencies(component);
            this.applyBabelConfig(component);
        });

        Mix.listen('loading-rules', rules => {
            this.applyRules(rules, component);
        });

        Mix.listen('loading-plugins', plugins => {
            this.applyPlugins(plugins, component);
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
        if (!component.activated || !component.dependencies) return;

        []
            .concat(component.dependencies())
            .filter(dependency => dependency)
            .forEach(dependency =>
                Verify.dependency(dependency, !!component.requiresReload)
            );
    }

    applyBabelConfig(component) {
        if (!component.activated || !component.babelConfig) return;

        Config.babelConfig = webpackMerge.smart(
            Config.babelConfig,
            component.babelConfig()
        );
    }

    applyRules(rules, component) {
        if (!component.activated || !component.webpackRules) return;

        tap(component.webpackRules(), newRules => {
            newRules && rules.push(...[].concat(newRules));
        });
    }

    applyPlugins(plugins, component) {
        if (!component.activated || !component.webpackPlugins) return;

        tap(component.webpackPlugins(), newPlugins => {
            newPlugins && plugins.push(...[].concat(newPlugins));
        });
    }
}

module.exports = ComponentFactory;
