import test from 'ava';
import bootstrap from '../../src/bootstrap';
import Stub from './Stub';
import fs from 'fs-extra';

let friendlyErrorOutput = require('friendly-errors-webpack-plugin/src/output');

global.Stub = Stub;

test.beforeEach(() => {
    global.mix = bootstrap();

    fs.ensureDirSync(`test/fixtures/app/dist`);
    mix.setPublicPath(`test/fixtures/app/dist`);

    friendlyErrorOutput.endCapture();
});

test.afterEach.always(t => {
    fs.removeSync(`test/fixtures/app/dist`);
});
