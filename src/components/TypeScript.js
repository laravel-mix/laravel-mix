let JavaScript = require('./JavaScript');

class TypeScript extends JavaScript {
    name() {
        return ['typeScript', 'ts'];
    }

    dependencies() {
        return ['ts-loader', 'typescript'].concat(super.dependencies());
    }

    webpackRules() {
        return [].concat(super.webpackRules()).push({
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/]
            }
        });
    }

    register(entry, output) {
        Config.typeScript = true;

        return super.register(entry, output);
    }
}

module.exports = TypeScript;
