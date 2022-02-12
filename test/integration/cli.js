import test from 'ava';
import path from 'path';
import request from 'supertest';
import { fileURLToPath } from 'url';
import { cli } from '../helpers/cli.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mix = cli({
    testing: false,
    env: { NODE_ENV: 'development' },
    cwd: path.resolve(__dirname, './fixture')
});

test('Missing config files result in non-zero exit code', async t => {
    const { code } = await mix(['--mix-config=webpack.mix.does-not-exist']);

    t.not(0, code);
});

test('Webpack errors result in non-zero exit code', async t => {
    const { code } = await mix(['--mix-config=webpack.mix.error']);

    t.not(0, code);
});

test('An empty mix file results in a successful build', async t => {
    const { code, stderr } = await mix(['--mix-config=webpack.mix.empty']);

    // TODO: This should show a warning that nothing is being compiled

    t.is(0, code);
    t.is(stderr, '');
});

const configFiles = {
    CJS: 'webpack.mix',
};

for (const [testName, fileName] of Object.entries(configFiles)) {
    test(`Run CLI with config: ${testName}`, async t => {
        const { code, stderr } = await mix([`--mix-config=${fileName}`]);

        t.is(0, code);
        t.is('', stderr);
    });
}

/*
test.serial('it removes the hot reloading file when the process is finished', async t => {
    let hotFilePath = path.join(__dirname, './fixture/public/hot');

    await mix(['watch --hot'], {
        onFirstOutput: ({ kill }) => kill()
    });

    t.false(File.exists(hotFilePath));
});

test.serial('Can run HMR', async t => {
    const req = request('http://localhost:1339');

    const { code, stdout } = await mix(['watch --hot -- --port 1339'], {
        // Give the server some time to start
        onRun: () => new Promise(resolve => setTimeout(resolve, 3500)),

        // Make sure requesting assets works…
        onFirstOutput: async ({ kill }) => {
            const response = await req.get('/js/app.js').timeout(10000)
            t.is(200, response.statusCode)

            // Then stop the server
            return kill()
        },
    });

    console.log(stdout)

    t.is(0, code);
    t.regex(stdout, /webpack compiled successfully/i);
});
*/
