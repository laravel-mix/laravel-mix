import test from 'ava';
import Mix from '../../src/Mix';
import fs from 'fs-extra';
import '../../src/helpers';

test.beforeEach(() => {
    let mix = new Mix().boot().api;

    // @ts-ignore
    global.mix = mix;

    fs.ensureDirSync(`test/fixtures/app/dist`);
    mix.setPublicPath(`test/fixtures/app/dist`);
});

test.afterEach.always(t => {
    fs.removeSync(`test/fixtures/app/dist`);
});
