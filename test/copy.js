import test from 'ava';
import * as mix from '../src/index';
import File from '../src/File';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';


test.afterEach(() => mix.config.reset());

test('that it can copy a file to a new location', t => {
    let from = new File(path.resolve(__dirname, 'from.txt'));
    let to = path.resolve(__dirname, 'to.txt');

    mix.copy(from.path(), to);

    t.deepEqual([{
        from: from.path(),
        to: to,
        flatten: true
    }], mix.config.copy);
});


test('that it can copy multiple files to a new location', t => {
    let from1 = path.resolve(__dirname, 'from1.txt');
    let from2 = path.resolve(__dirname, 'from2.txt');
    let to1 = path.resolve(__dirname, 'to1.txt');
    let to2 = path.resolve(__dirname, 'to2.txt');

    mix.copy(from1, to1);
    mix.copy(from2, to2);

    t.deepEqual([
        {
            from: from1,
            to: to1,
            flatten: true
        },
        {
            from: from2,
            to: to2,
            flatten: true
        }
    ], mix.config.copy);
});


test('that it can copy an array of files to a new location', t => {
    let from1 = path.resolve(__dirname, 'from1.txt');
    let from2 = path.resolve(__dirname, 'from2.txt');
    let to = path.resolve(__dirname, 'to');

    mix.copy([from1, from2], to);

    t.deepEqual([
        {
            from: from1,
            to: to,
            flatten: true
        },
        {
            from: from2,
            to: to,
            flatten: true
        }
    ], mix.config.copy);
});
