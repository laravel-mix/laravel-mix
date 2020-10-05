let path = require('path');
let File = require('./File');

module.exports = {
    record() {
        this.clean();

        if (!Config.hmr) {
            return;
        }

        this.hotFile().write(
            `${this.http()}://${Config.hmrOptions.host}:${this.port()}/`
        );
    },

    hotFile() {
        return new File(path.join(Config.publicPath, 'hot'));
    },

    http() {
        return process.argv.includes('--https') ? 'https' : 'http';
    },

    port() {
        return process.argv.includes('--port')
            ? process.argv[process.argv.indexOf('--port') + 1]
            : Config.hmrOptions.port;
    },

    clean() {
        this.hotFile().delete();
    }
};
