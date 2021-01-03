import test from 'ava';
import bootstrap from '../../src/bootstrap';
import fs from 'fs-extra';

test.beforeEach(() => {
    global.mix = bootstrap();

    fs.ensureDirSync(`test/fixtures/app/dist`);
    mix.setPublicPath(`test/fixtures/app/dist`);
});

test.afterEach.always(t => {
    fs.removeSync(`test/fixtures/app/dist`);
});
