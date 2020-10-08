import File from '../../src/File';

export default {
    manifestEquals: (expected, t) => {
        let manifest = JSON.parse(
            File.find(`test/fixtures/app/dist/mix-manifest.json`).read()
        );

        t.deepEqual(Object.keys(manifest).sort(), Object.keys(expected).sort());

        Object.keys(expected).forEach(key => {
            t.true(new RegExp(expected[key]).test(manifest[key]));
        });
    },

    /**
     * Assert that a file isn't empty.
     *
     * @param {string} path
     * @param {import("ava").Assertions} t
     */
    fileNotEmpty: (path, t) => {
        t.not(
            File.find(path)
                .read()
                .replace(/\s/g, ''),
            ''
        );
    },

    /**
     * Assert that a file path matches the given CSS.
     *
     * @param {string} path
     * @param {string} expected
     * @param {import("ava").Assertions} t
     */
    fileMatchesCss: (path, expected, t) => {
        t.is(
            File.find(path)
                .read()
                .replace(/\s/g, ''),
            expected.replace(/\s/g, '')
        );
    }
};
