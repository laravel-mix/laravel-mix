console.log('loaded: app.js');

async function run() {
    console.log('run: app.js');

    const mod = await import('./dynamic');
    mod.default();
}

run();
