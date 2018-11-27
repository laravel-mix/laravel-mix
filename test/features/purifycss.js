import mix from './helpers/setup';

test.cb.serial('it purifies CSS', t => {
    createPurifyStubs();

    mix.less(
        'test/fixtures/fake-app/resources/assets/less/app.less',
        'css'
    ).options({
        purifyCss: {
            paths: ['test/fixtures/fake-app/resources/views/stub.blade.php']
        }
    });

    compile(t, () => {
        let expected = `.shouldStay {
  color: green;
}`;

        t.is(
            expected,
            new File('test/fixtures/fake-app/public/css/app.css').read()
        );

        cleanUp();
    });
});

test.cb.serial('it purifies CSS with JS compilation', t => {
    createPurifyStubs();

    mix.js('test/fixtures/fake-app/resources/assets/js/app.js', 'js')
        .less('test/fixtures/fake-app/resources/assets/less/app.less', 'css')
        .options({
            purifyCss: {
                paths: ['test/fixtures/fake-app/resources/views/stub.blade.php']
            }
        });

    compile(t, () => {
        let expected = `.shouldStay {
  color: green;
}`;

        t.is(
            expected,
            new File('test/fixtures/fake-app/public/css/app.css').read()
        );

        cleanUp();
    });
});

let createPurifyStubs = () => {
    new File(
        'test/fixtures/fake-app/resources/assets/less/app.less'
    ).makeDirectories().write(`
        .shouldStay {
            color: green;
        }

        .shouldBeGone {
            color: red;
        }
    `);

    new File('test/fixtures/fake-app/resources/views/stub.blade.php')
        .makeDirectories()
        .write('<div class="shouldStay">foobar</div>');
};

let cleanUp = () => {
    File.find('test/fixtures/fake-app/resources/views/stub.blade.php').delete();

    File.find('test/fixtures/fake-app/resources/assets/less/app.less').delete();
};
