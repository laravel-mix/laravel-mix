let mix = require('../src/index');
let Verify = require('../src/Verify');

let components = [
    'fastsass',
    'less',
    'sass',
    'stylus',
    'postcss',
    'browsersync',
    'javascript',
    'preact',
    'react',
    'typescript',
    'autoloading'
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

    applyRules(rules, component) {
        if (!component.activated || !component.webpackRules) return;

        let newRules = component.webpackRules();

        if (newRules) {
            if (Array.isArray(newRules)) {
                rules.push(...newRules);
            } else {
                rules.push(newRules);
            }
        }
    }

    applyPlugins(plugins, component) {
        if (!component.activated || !component.webpackPlugins) return;

        let newPlugins = component.webpackPlugins();

        if (newPlugins) {
            if (Array.isArray(newPlugins)) {
                plugins.push(...newPlugins);
            } else {
                plugins.push(newPlugins);
            }
        }
    }
}

module.exports = ComponentFactory;
