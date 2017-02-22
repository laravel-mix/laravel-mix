import test from 'ava';
import options from '../src/Options';


test('that it merges options', t => {
    t.is(true, options.processCssUrls);

    options.merge({
        processCssUrls: false
    });

    t.is(false, options.processCssUrls);
});


test('that it deeply merges options', t => {
    t.deepEqual({
        warnings: false,
        drop_console: true
    }, options.uglify.compress);

    options.merge({
        uglify: {
            compress: {
                drop_console: false
            }
        }
    });

    // It should merge in the drop_console change, without
    // affecting any other default props on the object.
    t.deepEqual({
        warnings: false,
        drop_console: false
    }, options.uglify.compress);
});


test('that it appends to default arrays', t => {
    options.postCss = ['stub'];

    options.merge({
        postCss: ['some-postcss-plugin']
    });

    t.deepEqual([
        'stub', 'some-postcss-plugin'
    ], options.postCss);
});
