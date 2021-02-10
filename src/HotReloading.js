let path = require('path');
let File = require('./File');
let argv = require('yargs').argv;

module.exports = {
    record() {
        this.clean();

        if (!Config.hmr) {
            return;
        }

        this.hotFile().write(
            `${this.http()}://${this.host()}:${this.port()}/`
        );
    },

    hotFile() {
        return new File(path.join(Config.publicPath, 'hot'));
    },

    http() {
        return process.argv.includes('--https') ? 'https' : 'http';
    },

    port() {
        return argv.port || Config.hmrOptions.port;
    },

    host() {
	return argv.public || argv.host || Config.hmrOptions.host;
    },

    clean() {
        this.hotFile().delete();
    }
};
