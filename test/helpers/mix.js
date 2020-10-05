import test from 'ava';
import bootstrap from '../../src/bootstrap';
import fs from 'fs-extra';

let friendlyErrorOutput = require('friendly-errors-webpack-plugin/src/output');

test.beforeEach(() => {
    global.mix = bootstrap();

    fs.ensureDirSync('test/fixtures/fake-app/public');

    mix.setPublicPath('test/fixtures/fake-app/public');

    friendlyErrorOutput.endCapture();
});

test.afterEach.always(t => {
    fs.removeSync('test/fixtures/fake-app/public');
});
