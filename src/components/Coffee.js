let JavaScript = require('./JavaScript');

class Coffee extends JavaScript {
    dependencies() {
        return ['coffee-loader', 'coffeescript'].concat(super.dependencies());
    }

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
