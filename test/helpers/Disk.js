// @ts-check

import crypto from 'crypto';
import { promises as fs } from 'fs';
import fsx from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export class Disk {
    /** @type {Disk[]} */
    static #disks = [];

    constructor() {
        Disk.#disks.push(this);

        this.id = `${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
        this.keep = false;

        this.root = path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            '..',
            'disks',
            this.id
        );
    }

    async setup() {
        const source = path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            '..',
            'fixtures'
        );

        await fsx.copy(source, path.join(this.root, 'test/fixtures'));

        process.chdir(this.root);

        return this;
    }

    async cleanup() {
        // TODO REMOVE WORKAROUND:
        // Read the cwd to fix a weird issue inside (maybe?) graceful-fs.
        //
        // Reasoning:
        // A race condition occurs when tests are running too quickly causing
        // the cached, now-removed working directory to be used which will
        // cause any file operation to throw a file-not-foound error:
        // "ENOENT: no such file or directory, uv_cwd"
        //
        // This happens because of a few things:
        // 1. The default config parsing yargs arguments synchronously which
        //    implicitly relies on reading/caching the working directory by
        //    the package graceful-fs.
        // 2. Our need to change the current working directory to the root of the disk
        //    to work around path resolution issues.
        // 3. The temporary working directory gets cleaned up / removed after each test
        //
        // A few things can be done to eliminate the problem:
        // - Cleanup temporary disks after the whole test suite is done
        // - Eliminate path resolution to not rely on the current working directory at any point
        // - Read the current working directory before performing any file operations

        // We're choosing the last option here for now but only as a temporary solution.
        process.cwd();

        if (this.keep) {
            return;
        }

        if (process.versions.node.startsWith('12.')) {
            await fs.rmdir(this.root, { recursive: true }).catch(() => {});
        } else {
            await fs.rm(this.root, { recursive: true }).catch(() => {});
        }
    }

    keepAfterExit() {
        this.keep = true;
    }

    static async cleanupRecentlyCreated() {
        await Promise.all(this.#disks.map(async disk => disk.cleanup()));
    }

    /**
     *
     * @param {string} filepath
     */
    join(filepath) {
        return path.join(this.root, filepath);
    }
}
