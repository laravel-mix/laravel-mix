import test from 'ava';
import fs from 'fs-extra';

import { context } from '../helpers/test.js';

const hotFilePath = 'test/fixtures/app/dist/hot';

test.afterEach(async () => await fs.unlink(hotFilePath).catch(() => {}));
test.afterEach(async () => await fs.unlink(hotFilePath).catch(() => {}));

test('it creates a file to mark a request for hot reloading', async t => {
    const { mix, Mix, assert } = context(t);

    mix.options({ hmr: true });

    assert().file(hotFilePath).absent();

    // Mix should listen for the "init" event before checking
    // if the user desires hot reloading.
    await Mix.init();

    assert().file(hotFilePath).exists();
});

test('it reads HMR details from options', async t => {
    const { mix, Mix, assert } = context(t);

    mix.options({
        hmr: true,
        hmrOptions: {
            https: true,
            host: 'example.com',
            port: 1337
        }
    });

    assert().file(hotFilePath).absent();

    // Mix should listen for the "init" event before checking
    // if the user desires hot reloading.
    await Mix.init();

    assert().file(hotFilePath).exists();
    assert().file(hotFilePath).contains('https://example.com:1337');
});
