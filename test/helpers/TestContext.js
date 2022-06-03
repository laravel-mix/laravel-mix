import { promises as fsx } from 'fs';
import * as webpack from './webpack.js';
import * as babel from './babel.js';

import { fs } from './fs.js';
import { Disk } from './Disk.js';
import { assert } from './assertions.js';
import Mix from '../../src/Mix.js';

/**
 * @template {object} MetadataType
 */
export class TestContext {
    /**
     * @param {import('ava').ExecutionContext} t
     */
    constructor(t) {
        this.t = t;
        this.disk = new Disk();
        this.Mix = new Mix();
        this.publicPath = 'test/fixtures/app/dist';

        /** @type {MetadataType} */
        this.metadata = {};

        /** @type {ReturnType<typeof babel.recordConfigsImpl>} */
        // @ts-ignore
        this.babel = null;
    }

    get fs() {
        return () => fs(this.t);
    }

    get assert() {
        return () => assert(this.t);
    }

    async setup() {
        this.Mix.paths.rootPath = this.disk.root;

        this.babel = await babel.recordConfigs();

        await this.Mix.boot();
        await this.disk.setup();

        const publicPath = this.disk.join(this.publicPath);

        // Set the output path to the appropriate directory in the temporary disk
        await fsx.mkdir(publicPath, { mode: 0o777, recursive: true });
        this.mix.setPublicPath(this.publicPath);

        // We also disable autoprefixer
        // Under profiling loading autoprefixer takes 2.5s
        this.mix.options({ autoprefixer: false });

        // We also enable assetModules
        // TODO: Remove in Mix 7 -- this should be the default then
        this.mix.options({ assetModules: true });
    }

    teardown() {
        if (!this.t.passed) {
            this.disk.keepAfterExit();
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
 * @template {object} T
 * @param {import('ava').ExecutionContext} t
 * @param {T} [metadata]
 * @returns {TestContext<T>}
 */
export const context = (t, metadata = undefined) => {
    if (t.context instanceof TestContext) {
        t.context.t = t;
    } else {
        t.context = new TestContext(t);
    }

    Object.assign(t.context.metadata, metadata || {});

    return t.context;
};
