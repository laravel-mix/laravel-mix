const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');

// Flat config (ESLint 9). Replaces the legacy .eslintrc.js.
module.exports = [
    {
        ignores: [
            'test/fixtures/integration/dist/**',
            'test/integration/fixture/**',
            'test/disks/**'
        ]
    },
    js.configs.recommended,
    {
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2021
            }
        },
        rules: {
            'no-const-assign': 'off',
            'newline-before-return': 'error',
            semi: 'error',
            'no-unreachable': 'error',
            'no-extra-semi': 'error',
            'no-unexpected-multiline': 'error',
            'comma-dangle': [
                'error',
                {
                    arrays: 'never',
                    objects: 'never',
                    imports: 'never',
                    exports: 'never',
                    functions: 'never'
                }
            ]
        }
    }
];
