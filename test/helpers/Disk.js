// @ts-check

import crypto from 'crypto';
import { promises as fs } from 'fs';
import fsx from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export class Disk {
    constructor() {
        this.id = `${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
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
        if (process.versions.node.startsWith('12.')) {
            await fs.rmdir(this.root, { recursive: true }).catch(() => {});
        } else {
            await fs.rm(this.root, { recursive: true }).catch(() => {});
        }
    }

    /**
     *
     * @param {string} filepath
     */
    join(filepath) {
        return path.join(this.root, filepath);
    }
}
