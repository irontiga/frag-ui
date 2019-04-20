import babel from 'rollup-plugin-babel'

import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import commonjs from 'rollup-plugin-commonjs'

import sass from 'rollup-plugin-sass'
import autoprefixer from 'autoprefixer'
// import postcss from 'rollup-plugin-postcss'
import postcss from 'postcss'

import minifyHTML from 'rollup-plugin-minify-html-literals'
// import { terser } from 'rollup-plugin-terser'

const sassOptions = {
    output: 'build/styles.bundle.css',
    processor: css => postcss([autoprefixer])
        .process(css)
        .then(result => result.css)
}

const babelOptions = {
    exclude: 'node_modules/**',
    // exclude: 'node_modules/core-js/**',
    ignore: [/[\/\\]core-js/],
    presets: [
        [
            '@babel/preset-env',
            {
                'targets': 'Chrome 60, Firefox 66',
                // debug: true,
                // modules: 'false',
                // targets: {
                //     browsers: 'Edge 16, Firefox 60, Chrome 61, Safari 11, Android 67, ChromeAndroid 73, FirefoxAndroid 66'
                // },
                useBuiltIns: 'usage',
                corejs: '3'
            }
        ]
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import'
    ]
}

const plugins = [
    resolve({
        module: true
    }),
    commonjs({}),
    globals(),
    builtins(),
    sass(sassOptions),
    minifyHTML()
    // terser()
]

export default [
    {
        context: 'window',
        input: 'src/main.js',
        output: [
            {
                dir: 'build/es6',
                format: 'es'
            }
        ],
        plugins: plugins.concat([
            babel(babelOptions)
        ])
    },
    {
        context: 'window',
        input: 'src/main.js',
        output: [
            {
                dir: 'build/es5',
                format: 'system'
            }
        ],
        plugins: plugins.concat([babel({
            ...babelOptions,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'usage',
                        targets: 'IE 10',
                        corejs: '3'
                    }
                ]
            ]
        })])
    }
]