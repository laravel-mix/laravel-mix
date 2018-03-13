let JavaScript = require('./JavaScript');

class Coffee extends JavaScript {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['coffee-loader', 'coffeescript'].concat(super.dependencies());
    }

    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                test: /\.coffee$/,
                use: ['coffee-loader']
            }
        ].concat(super.webpackRules());
    }
}

module.exports = Coffee;
