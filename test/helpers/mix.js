import test from 'ava';
import { promises as fs } from 'fs';

import MixClass from '../../src/Mix.js';
import '../../src/helpers.js';

/** @type {import('../../src/Mix')} */
export let Mix;

/** @type {import('../../src/Mix')['api']} */
export let mix;

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname + '/../../');

test.beforeEach(async () => {
    Mix = new MixClass().boot();
    mix = Mix.api;

    if (process.versions.node.startsWith('12.')) {
        await fs.rmdir(`test/fixtures/app/dist`, { recursive: true }).catch(() => {});
    } else {
        await fs.rm(`test/fixtures/app/dist`, { recursive: true }).catch(() => {});
    }

    await fs.mkdir(`test/fixtures/app/dist`, { mode: 0o777, recursive: true });
    mix.setPublicPath(`test/fixtures/app/dist`);
});
