import fsx from 'fs-extra';
import path from 'path';

/**
 *
 * @param {import('ava').ExecutionContext<unknown>} t
 */
export function fs(t) {
    return {
        /**
         * @param {Record<string, string>} layout
         */
        async stub(layout) {
            const entries = Object.entries(layout);

            // 1. Create a directory layout on the file system
            await Promise.all(
                entries.map(entry => fsx.ensureDir(path.dirname(entry[0])))
            );

            // 2. Write files to disk
            await Promise.all(entries.map(entry => fsx.writeFile(...entry)));

            // 3. Remove all written files when the test is done
            t.teardown(async () => {
                await Promise.all(entries.map(entry => fsx.remove(entry[0])));
            });
        }
    };
}
