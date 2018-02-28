let JavaScript = require('./JavaScript');

class TypeScript extends JavaScript {
    name() {
        return ['typeScript', 'ts'];
    }

    dependencies() {
        return ['ts-loader', 'typescript'].concat(super.dependencies());
    }

    webpackRules() {
        let rules = [].concat(super.webpackRules());

        if (Mix.isUsing('typeScript')) {
            rules.push({
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            });
        }

        return rules;
    }

    register(entry, output) {
        Config.typeScript = true;

        return super.js(entry, output);
    }
}

module.exports = TypeScript;
