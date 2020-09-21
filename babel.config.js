module.exports = {
    'presets': [
        '@babel/preset-env',
    ],
    'plugins': [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-syntax-class-properties',
        '@babel/plugin-syntax-object-rest-spread',
        'yui-compressor-fix-reserved-keywords',
        [
            'babel-plugin-module-resolver', {
                root: [
                    './'
                ]
            }
        ],
    ]
};