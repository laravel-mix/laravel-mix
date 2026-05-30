export default {
    // Rspack 2.0 is pure ESM; loading it from our CommonJS source triggers
    // Node's experimental require(esm) warning on every compile. Silence it so
    // the test output stays readable.
    nodeArguments: ['--disable-warning=ExperimentalWarning'],
    files: [
        'features/*.js',
        '!features/vue.js',
        'integration/*.js',
        'integration/plugins/*.js',
        'unit/*.js',
        'unit/plugins/*.js'
    ]
};
