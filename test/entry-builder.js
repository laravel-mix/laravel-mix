import test from 'ava';
import mix from '../src/index';
import {resolve} from 'path';

test.afterEach(t => {
    mix.config.js = [];
    mix.config.preprocessors = false;
    mix.config.extract = false;
    mix.config.entryBuilder.reset();
});

test('that it builds the entry for basic JS and vendor extraction', t => {
    mix.js('src/app.js', 'dist')
       .sass('src/app.scss', 'dist')
       .extract(['vue']);

    t.deepEqual({
        'dist/app': [
            resolve('src/app.js'),
            resolve('src/app.scss')
        ],
        'dist/vendor': ['vue']
    }, mix.config.entry());
});


test('that it builds the entry, even if mix.js() is never called.', t => {
    mix.sass('src/app.scss', 'dist');

    t.deepEqual({
        'mix': [
            resolve('src/mock-entry.js'),
            resolve('src/app.scss')
        ]
    }, mix.config.entry());
});


test('it deletes the temporary script once Webpack finishes compiling.', t => {
    // We'll whip up a fake Webpack build stats object.
    let temporaryScript = resolve(__dirname, 'fixtures/mix-entry.js');
    let statsFake = {
        toJson: function () {
            return {
                assets: [
                    {
                        chunkNames: ['mix'],
                        name: temporaryScript
                    }
                ]
            }
        }
    };

    // And create the corresponding temporary script.
    new File(temporaryScript).write('stub');

    // If we then set up a Mix configuration, and build the entry...
    mix.sass('src/app.scss', 'dist');
    mix.config.entry();

    // Then, after the build event is fired, the temporary script
    // should be deleted. It's not needed by the user.
    global.events.fire('build', statsFake);
    t.false(File.exists());
});
