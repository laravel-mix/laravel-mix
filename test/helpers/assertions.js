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
    }
};
