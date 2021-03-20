import test from 'ava';
import MixClass from '../../src/Mix';
import fs from 'fs-extra';
import '../../src/helpers';

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

test.afterEach.always(t => {
    fs.removeSync(`test/fixtures/app/dist`);
});
