const JavaScript = require('./JavaScript');

module.exports = class Coffee extends JavaScript {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['coffee-loader', 'coffeescript'].concat();
    }

    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                test: /\.coffee$/,
                use: [{ loader: this.context.resolve('coffee-loader') }]
            },
            ...super.webpackRules()
        ];
    }
};
