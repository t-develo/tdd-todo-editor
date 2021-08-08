module.exports = {
    env: {
        browser: true,
        es6: true,
        'jest/globals': true,
    },
    extends: ['plugin:vue/essential', 'google', 'prettier', '@vue/prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        parser: 'babel-eslint',
    },
    plugins: ['vue', 'jest'],
    rules: {},
    'require-jsdoc': false,
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                mocha: true,
            },
        },
    ],
};
