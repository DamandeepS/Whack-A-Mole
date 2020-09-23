export default {
    files: [
        'app/**/*.test.js'
    ],
    require: [
        './test-helpers/_testHelperBabel.js',
        './test-helpers/_testHelperENV.js',
        '@babel/polyfill',
    ],
    verbose: true,
}
