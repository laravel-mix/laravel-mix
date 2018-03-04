let JavaScript = require('./JavaScript');

class TypeScript extends JavaScript {
    name() {
        return ['typeScript', 'ts'];
    }

    dependencies() {
        return ['ts-loader', 'typescript'].concat(super.dependencies());
    }

    webpackRules() {
        return [].concat(super.webpackRules(), {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/]
            }
        });
    }

    webpackConfig(config) {
        config.resolve.extensions.push('.ts', '.tsx');
        config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js';
    }
}

module.exports = TypeScript;
