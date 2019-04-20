module.exports = {
    'presets': [
        [
            '@babel/preset-env',
            {
                // modules: 'false',
                useBuiltIns: 'usage',
                corejs: '2'
            }
        ]
    ],
    'plugins': [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/external-helpers'
    ]
}
