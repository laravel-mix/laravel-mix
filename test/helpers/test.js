import test from 'ava';
import { Disk } from './Disk.js';

import { context } from './TestContext.js';
export { context };

test.beforeEach(t => context(t).setup());
test.afterEach.always(t => context(t).teardown());
test.after.always(() => Disk.cleanupRecentlyCreated());
