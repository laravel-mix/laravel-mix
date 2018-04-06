let process = require('child_process');
let File = require('../src/File');

class Dependencies {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    install(abortOnComplete = false) {
        this.dependencies
            .reject(dependency => {
                try {
                    return require.resolve(
                        dependency.replace(/(?!^@)@.+$/, '')
                    );
                } catch (e) {}
            })
            .tap(dependencies => {
                this.execute(
                    this.buildInstallCommand(dependencies),
                    abortOnComplete
                );
            });
    }

    execute(command, abortOnComplete) {
        console.log(
            'Additional dependencies must be installed. ' +
                'This will only take a moment.'
        );

        process.execSync(command);

        if (abortOnComplete) {
            console.log(
                typeof abortOnComplete === 'string'
                    ? abortOnComplete
                    : 'Finished. Please run Mix again.'
            );

            process.exit();
        }
    }

    buildInstallCommand(dependencies) {
        dependencies = [].concat(dependencies).join(' ');

        if (File.exists('yarn.lock')) {
            return `yarn add ${dependencies} --dev`;
        }

        return `npm install ${dependencies} --save-dev`;
    }
}

module.exports = Dependencies;
