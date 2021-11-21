import { promises as fsx } from 'fs';
import * as webpack from './webpack.js';
import * as babel from './babel.js';

import { fs } from './fs.js';
import { Disk } from './Disk.js';
import { assert } from './assertions.js';

import Mix from '../../src/Mix.js';

export class TestContext {
    /**
     * @param {import('ava').ExecutionContext} t
     */
    constructor(t) {
        this.t = t;
        this.disk = new Disk();
        this.Mix = new Mix();
        this.publicPath = 'test/fixtures/app/dist';

        /** @type {ReturnType<typeof babel.recordConfigsImpl>} */
        // @ts-ignore
        this.babel = null;

        /**
         * @param {import('ava').ExecutionContext} t
         */
        this.fs = fs(t);

        /**
         * @param {import('ava').ExecutionContext} t
         */
        this.assert = assert(t);
    }

    async setup() {
        this.Mix.paths.rootPath = this.disk.root;

        this.babel = await babel.recordConfigs();

        await this.Mix.boot();
        await this.disk.setup();

        const publicPath = this.disk.join(this.publicPath)

        // Set the output path to the appropriate directory in the temporary disk
        await fsx.mkdir(publicPath, { mode: 0o777, recursive: true })
        this.mix.setPublicPath(this.publicPath);

        // We also disable autoprefixer
        // Under profiling loading autoprefixer takes 2.5s
        this.mix.options({ autoprefixer: false });
    }

    async teardown() {
        if (this.t.passed) {
            await this.disk.cleanup();
        }
    }

    async config() {
        // By default we disable notifications during tests because it's annoying
        if (process.env.DISABLE_NOTIFICATIONS === undefined) {
            process.env.DISABLE_NOTIFICATIONS = '1';
        }

        await this.Mix.init();
        return this.Mix.build();
    }

    async build() {
        return webpack.compile(this.config());
    }

    get mix() {
        return this.Mix.api;
    }

    get webpack() {
        return {
            buildConfig: () => this.config(),
            compile: () => this.build()
        };
    }

    get babelConfig() {
        return this.babel;
    }
}

/**
 * @param {import('ava').ExecutionContext} t
 */
export const context = t => {
    if (t.context instanceof TestContext) {
        return t.context;
    }

    return (t.context = new TestContext(t));
};
