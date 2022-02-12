import test from 'ava';
import path from 'path';
import sinon from 'sinon';
import { fileURLToPath } from 'url';

import File from '../../src/File.js';
import FileCollection from '../../src/FileCollection.js';
import { context } from '../helpers/test.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stubsDir = path.resolve(__dirname, 'stubs');

test('that it can get the underlying files', t => {
    const files = ['path/to/file.js'];

    t.deepEqual(files, new FileCollection(files).get());
});

test.serial('that it can merge multiple files into one.', async t => {
    const { assert, fs } = context(t);

    const files = [path.resolve(stubsDir, 'one.js'), path.resolve(stubsDir, 'two.js')];
    const outputPath = path.resolve(stubsDir, 'merged.js');

    await fs(t).stub({
        [files[0]]: 'class Foo {}',
        [files[1]]: 'class Bar {}'
    });

    await new FileCollection(files).merge(new File(outputPath));

    assert(t).file(outputPath).exists();
    assert(t).file(outputPath).contains('class Foo {}\nclass Bar {}');
});

test.serial('that it can merge JS files and apply Babel compilation.', async t => {
    const { assert, fs } = context(t);

    const files = [path.resolve(stubsDir, 'one.js'), path.resolve(stubsDir, 'two.js')];
    const outputPath = path.resolve(stubsDir, 'merged.js');

    await fs(t).stub({
        [files[0]]: 'class Foo {}',
        [files[1]]: 'class Bar {}'
    });

    const collection = new FileCollection(files);

    sinon.stub(collection, 'babelify').callsFake(() => 'fake minified output');

    await collection.merge(new File(outputPath), true);

    assert(t).file(outputPath).exists();
    assert(t).file(outputPath).contains('fake minified output');
});

test.serial("that it throw an error if a file doesn't exist.", async t => {
    const { assert } = context(t);

    const files = [path.resolve(stubsDir, 'fileThatDoesntExist.js')];
    const outputPath = path.resolve(stubsDir, 'mergedWithFileThatDoesntExist.js');

    await t.throwsAsync(() => new FileCollection(files).merge(new File(outputPath)));

    assert(t).file(outputPath).absent();
});
