import test from 'ava';
import fs from 'fs-extra';

import { context } from '../helpers/test.js';

const hotFilePath = 'test/fixtures/app/dist/hot';

test.afterEach(async () => await fs.unlink(hotFilePath).catch(() => {}));
test.afterEach(async () => await fs.unlink(hotFilePath).catch(() => {}));

test('it creates a file to mark a request for hot reloading', async t => {
    const { mix, Mix, assert } = context(t);

    mix.options({ hmr: true });

    assert(t).file(hotFilePath).absent();

    // Mix should listen for the "init" event before checking
    // if the user desires hot reloading.
    await Mix.init();

    assert(t).file(hotFilePath).exists();
});
