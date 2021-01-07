module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: 'auto',
                targets: { node: 'current' }
            }
        ]
    ],
    plugins: [
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true
            }
        ]
    ]
};
