import test from 'ava';
import fs from 'fs-extra';

import MixClass from '../../src/Mix.js';
import '../../src/helpers.js';

/** @type {import('../../src/Mix')} */
export let Mix;

/** @type {import('../../src/Mix')['api']} */
export let mix;

test.beforeEach(() => {
    Mix = new MixClass().boot();
    mix = Mix.api;

    fs.ensureDirSync(`test/fixtures/app/dist`);
    mix.setPublicPath(`test/fixtures/app/dist`);
});

test.afterEach.always(() => {
    fs.removeSync(`test/fixtures/app/dist`);
});
