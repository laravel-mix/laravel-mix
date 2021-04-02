let path = require('path');
let File = require('./File');

class HotReloading {
    /**
     *
     * @param {import('./Mix')} mix
     */
    constructor(mix) {
        this.mix = mix;
    }

    record() {
        this.clean();

        if (!this.mix.config.hmr) {
            return;
        }

        this.hotFile().write(
            `${this.http()}://${this.mix.config.hmrOptions.host}:${this.port()}`
        );
    }

    hotFile() {
        return new File(path.join(this.mix.config.publicPath, 'hot'));
    }

    http() {
        return process.argv.includes('--https') ? 'https' : 'http';
    }

    port() {
        return process.argv.includes('--port')
            ? process.argv[process.argv.indexOf('--port') + 1]
            : this.mix.config.hmrOptions.port;
    }

    clean() {
        this.hotFile().delete();
    }

    /** @deprecated */
    static record() {
        return new HotReloading(global.Mix).record();
    }

    /** @deprecated */
    static hotFile() {
        return new HotReloading(global.Mix).hotFile();
    }

    /** @deprecated */
    static http() {
        return new HotReloading(global.Mix).http();
    }

    /** @deprecated */
    static port() {
        return new HotReloading(global.Mix).port();
    }

    /** @deprecated */
    static clean() {
        return new HotReloading(global.Mix).clean();
    }
}

module.exports = HotReloading;
