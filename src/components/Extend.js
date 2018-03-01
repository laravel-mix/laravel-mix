let ComponentFactory = require('../ComponentFactory');

class Extend {
    register(name, component) {
        if (typeof component === 'function') {
            component = { register: component };
        }

        component.name = () => name;

        new ComponentFactory().install(component);
    }
}

module.exports = Extend;
