import mock from 'mock-require';
import test from 'ava';
import mockFs from 'mock-fs';
import mix from '../../src/index';

// This represents the new files from the most recent Webpack compile.
// They *should not* be deleted.
let newlyCompiledFiles = {
    'public/js/app.6b65aa0397ed112f25f6.js': 'foobar',
    'public/css/app.a77184666fc90f945bfb72e339c8dcf1.css': 'foobar',
    'public/mix-manifest.json': 'foobar'
};

// And these are the old compiled files that are no longer needed.
// They *should* be deleted.
let oldCompiledFiles = {
    'public/js/app.old5aa0397ed112f25f6.js': 'old',
    'public/css/app.old184666fc90f945bfb72e339c8dcf1.css': 'old'
};

// Any files in the manifest should never be deleted. Let's add one, just to be sure.
let otherFileInManifest = 'public/js/some-other-file-in-manifest.z12184666fc90f945bfb72e339c8dcf1.js';

Mix.manifest.manifest = {
    'public/js/some-other-file-in-manifest.js': 'public/js/some-other-file-in-manifest.z12184666fc90f945bfb72e339c8dcf1.js'
};

// We'll use a fake fs, and force glob to return a hardcoded set of files,
// so that we don't have to resort to real fixture files.
let mockedFiles = Object.assign({}, newlyCompiledFiles, oldCompiledFiles, {
    [otherFileInManifest]: 'foo'
});

mock('glob', function (files, callback) {
    return callback(null, Object.keys(mockedFiles));
});

let CleanVersionedFilesPlugin = require('../../src/plugins/CleanVersionedFilesPlugin');

test('it deletes old versioned files', t => {
    // Let's fake that these files all exist on our system.
    mockFs(mockedFiles);

    // // When this Webpack plugin runs, it should delete only the old files.
    // // The Webpack compiler will send through all of the new assets, so
    // // we can safely delete all matched files that aren't in that list.
    new CleanVersionedFilesPlugin().apply(fakeCompiler(newlyCompiledFiles));

    Object.keys(newlyCompiledFiles).forEach(file => t.true(File.exists(file)));
    Object.keys(oldCompiledFiles).forEach(file => t.false(File.exists(file)));

    t.true(File.exists(otherFileInManifest));

    mockFs.restore();
});

function fakeCompiler(newlyCompiledFiles) {
    return {
        plugin: function (state, callback) {
            return callback({
                toJson() {
                    return {
                        assets: Object.keys(newlyCompiledFiles).map(function (name) {
                            // The real compiler won't include the public path in
                            // the path, so we'll strip it off here.
                            return { name: name.replace(Config.publicPath, '') };
                        })
                    }
                }
            });
        }
    };
}
