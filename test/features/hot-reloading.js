import test from 'ava';
import { promises as fs } from 'fs';
import path from 'path';

import File from '../../src/File.js';
import { mix, Mix } from '../helpers/mix.js';

test('it creates a file to mark a request for hot reloading', async t => {
    mix.setPublicPath(__dirname).options({ hmr: true });

    let hotFilePath = path.join(__dirname, 'hot');

    try {
        await fs.unlink(hotFilePath);
    } catch (err) {
        //
    }

    t.false(File.exists(hotFilePath));

    // Mix should listen for the "init" event before checking
    // if the user desires hot reloading.
    await Mix.init();

    t.true(File.exists(hotFilePath));
});
