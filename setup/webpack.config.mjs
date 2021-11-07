import Mix from '../src/Mix.js';

export default async function () {
    // @ts-ignore
    process.noDeprecation = true;

    const mix = Mix.shared;

    // Boot mix
    await mix.boot();

    // Load the user's mix config
    await mix.load();

    // Install any missing dependencies
    await mix.installDependencies();

    // Start running
    await mix.init();

    // Turn everything into a config
    return await mix.build();
}
