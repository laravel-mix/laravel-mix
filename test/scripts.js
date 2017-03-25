import test from 'ava';
import mix from '../src/index';

let scripts = global.scripts;

test('that it registers a new JS bundle request.', t => {
    scripts.add('src/src.js', 'dist/bundle.js');
    t.is('dist/bundle.js', scripts.scripts[0].output.path);
    t.is(path.resolve('src/src.js'), scripts.scripts[0].entry[0].path);

    scripts.reset();

    // If the output is a folder, it should fetch its file name from the src.
    scripts.add('src/src.js', 'dist');
    t.is('dist/src.js', scripts.scripts[0].output.path);
});


test('that it sets a base output folder when registering', t => {
    scripts.add('src/src.js', 'dist/bundle.js');

    t.is('dist', scripts.base);
});
