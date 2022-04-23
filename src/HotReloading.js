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

        const { https, host, port } = this.mix.config.hmrOptions;
        const protocol = https ? 'https' : 'http';
        const url = `${protocol}://${host}:${port}`;

        this.hotFile().write(url);

        process.on('exit', () => this.clean());
        process.on('SIGINT', () => this.clean());
        process.on('SIGHUP', () => this.clean());
    }

    hotFile() {
        return new File(path.join(this.mix.config.publicPath, 'hot'));
    }

    /** @deprecated */
    http() {
        return this.mix.config.hmrOptions.https ? 'https' : 'http';
    }

    /** @deprecated */
    port() {
        return this.mix.config.hmrOptions.port;
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
