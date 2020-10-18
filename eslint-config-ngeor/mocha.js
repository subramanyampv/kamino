module.exports = {
    extends: [
        'ngeor'
    ],
    env: {
        mocha: true
    },
    rules: {
        'no-magic-numbers': [
            'off'
        ],
        'no-unused-expressions': [
            'off'
        ],
        'max-statements': [
            'off'
        ],
        'max-nested-callbacks': [
            'error',
            5
        ]
    }
};
